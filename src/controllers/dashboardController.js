const { getTopTargetedAssets } = require('../services/dashboardService');

async function topTargetedAssets(req, res, next) {
  try {
    const data = await getTopTargetedAssets(5);

    return res.json({
      success: true,
      message: 'Successfully fetched top targeted assets',
      meta: { total_data: data.length },
      data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { topTargetedAssets };
