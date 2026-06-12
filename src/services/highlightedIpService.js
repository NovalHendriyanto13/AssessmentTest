const pool = require('../config/postgres');
const esClient = require('../config/elasticsearch');

const ES_INDEX = 'security-alerts';

async function getAllHighlightedIps({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows, countResult] = await Promise.all([
    pool.query(
      `SELECT * FROM highlighted_ips ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    pool.query(`SELECT COUNT(*) FROM highlighted_ips`),
  ]);
  return {
    total: parseInt(countResult.rows[0].count),
    data: rows.rows,
  };
}

async function getHighlightedIpById(id) {
  const result = await pool.query(`SELECT * FROM highlighted_ips WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function createHighlightedIp({ ip_address, label, reason }) {
  const result = await pool.query(
    `INSERT INTO highlighted_ips (ip_address, label, reason)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [ip_address, label || null, reason || null]
  );
  return result.rows[0];
}

async function updateHighlightedIp(id, { ip_address, label, reason }) {
  const result = await pool.query(
    `UPDATE highlighted_ips
     SET ip_address = COALESCE($1, ip_address),
         label      = COALESCE($2, label),
         reason     = COALESCE($3, reason),
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [ip_address || null, label || null, reason || null, id]
  );
  return result.rows[0] || null;
}

async function deleteHighlightedIp(id) {
  const result = await pool.query(
    `DELETE FROM highlighted_ips WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
}

async function getActivityForHighlightedIps({ page = 1, limit = 20, sort = 'desc' } = {}) {
  const ipResult = await pool.query(`SELECT ip_address FROM highlighted_ips`);
  const ips = ipResult.rows.map((r) => r.ip_address).filter(Boolean);

  if (ips.length === 0) {
    return { total: 0, data: [] };
  }

  const from = (page - 1) * limit;

  const response = await esClient.search({
    index: ES_INDEX,
    body: {
      from,
      size: limit,
      sort: [{ timestamp: { order: sort === 'asc' ? 'asc' : 'desc' } }],
      query: {
        terms: { src_ip: ips },
      },
    },
  });

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

  return { total, data };
}

module.exports = {
  getAllHighlightedIps,
  getHighlightedIpById,
  createHighlightedIp,
  updateHighlightedIp,
  deleteHighlightedIp,
  getActivityForHighlightedIps,
};
