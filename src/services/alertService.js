const esClient = require('../config/elasticsearch');
const pool = require('../config/postgres');

const ES_INDEX = 'security-alerts';

async function getFilteredAlerts({ department, risk, page = 1, limit = 20, sort = 'desc' }) {
  const conditions = [];
  const values = [];

  if (department) {
    values.push(department);
    conditions.push(`department_owner = $${values.length}`);
  }
  if (risk) {
    values.push(risk);
    conditions.push(`risk_level = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const assetResult = await pool.query(
    `SELECT host_identifier_local FROM internal_infrastructure_assets ${whereClause}`,
    values
  );

  const targetIps = assetResult.rows.map((r) => r.host_identifier_local).filter(Boolean);

  if ((department || risk) && targetIps.length === 0) {
    return { total: 0, page, limit, data: [] };
  }

  const from = (page - 1) * limit;
  const mustClauses = [];

  if (targetIps.length > 0) {
    mustClauses.push({ terms: { network_target_ip: targetIps } });
  }

  const esQuery = {
    index: ES_INDEX,
    body: {
      from,
      size: limit,
      sort: [{ timestamp: { order: sort === 'asc' ? 'asc' : 'desc' } }],
      query: mustClauses.length > 0 ? { bool: { must: mustClauses } } : { match_all: {} },
    },
  };

  const response = await esClient.search(esQuery);
  const hits = response.hits.hits;
  const total =
    typeof response.hits.total === 'object'
      ? response.hits.total.value
      : response.hits.total;

  const data = hits.map((hit) => ({
    timestamp: hit._source.timestamp,
    source_ip: hit._source.src_ip,
    target_ip: hit._source.network_target_ip,
    alert_name: hit._source.signature_name,
    severity: hit._source.severity,
  }));

  return { total, page, limit, data };
}

module.exports = { getFilteredAlerts };
