const esClient = require('../config/elasticsearch');
const pool = require('../config/postgres');

const ES_INDEX = 'security-alerts';

async function getTopTargetedAssets(topN = 5) {
  const response = await esClient.search({
    index: ES_INDEX,
    body: {
      size: 0,
      aggs: {
        top_targets: {
          terms: {
            field: 'network_target_ip',
            size: topN,
            order: { _count: 'desc' },
          },
        },
      },
    },
  });

  const buckets = response.aggregations?.top_targets?.buckets || [];

  if (buckets.length === 0) {
    return [];
  }

  const ips = buckets.map((b) => b.key);

  const assetResult = await pool.query(
    `SELECT host_identifier_local, asset_name, department_owner, risk_level
     FROM internal_infrastructure_assets
     WHERE host_identifier_local = ANY($1::text[])`,
    [ips]
  );

  const assetMap = {};
  assetResult.rows.forEach((row) => {
    assetMap[row.host_identifier_local] = row;
  });

  return buckets.map((bucket) => {
    const asset = assetMap[bucket.key] || {};
    return {
      target_ip: bucket.key,
      total_attacks: bucket.doc_count,
      asset_name: asset.asset_name || null,
      department: asset.department_owner || null,
    };
  });
}

module.exports = { getTopTargetedAssets };
