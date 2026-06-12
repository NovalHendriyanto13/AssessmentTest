const pool = require('../config/postgres');
const esClient = require('../config/elasticsearch');

async function checkHealth() {
  const services = { postgres: 'down', elasticsearch: 'down' };

  try {
    await pool.query('SELECT 1');
    services.postgres = 'up';
  } catch (err) {
    console.error('PostgreSQL health check failed:', err.message);
  }

  try {
    await esClient.ping();
    services.elasticsearch = 'up';
  } catch (err) {
    console.error('Elasticsearch health check failed:', err.message);
  }

  const allUp = Object.values(services).every((s) => s === 'up');
  return {
    status: allUp ? 'healthy' : 'degraded',
    services,
  };
}

module.exports = { checkHealth };
