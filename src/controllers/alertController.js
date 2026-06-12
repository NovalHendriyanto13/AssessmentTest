const { getFilteredAlerts } = require('../services/alertService');

async function listAlerts(req, res, next) {
  try {
    const { department, risk, page = 1, limit = 20, sort } = req.query;

    const result = await getFilteredAlerts({
      department,
      risk,
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
    });

    return res.json({
      success: true,
      message: 'Successfully fetched alert logs',
      meta: {
        total_data: result.total,
        page: result.page,
        limit: result.limit,
      },
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAlerts };
