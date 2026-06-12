const { checkHealth } = require('../services/healthService');

async function healthCheck(req, res, next) {
  try {
    const result = await checkHealth();
    const statusCode = result.status === 'healthy' ? 200 : 503;
    return res.status(statusCode).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { healthCheck };
