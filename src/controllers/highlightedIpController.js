const svc = require('../services/highlightedIpService');

async function listHighlightedIps(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await svc.getAllHighlightedIps({ page: parseInt(page), limit: parseInt(limit) });
    return res.json({
      success: true,
      message: 'Successfully retrieved data',
      meta: { total_data: result.total, page: parseInt(page), limit: parseInt(limit) },
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

async function createHighlightedIp(req, res, next) {
  try {
    const record = await svc.createHighlightedIp(req.body);
    return res.status(201).json({
      success: true,
      message: 'Highlighted IP added',
      data: record,
    });
  } catch (err) {
    // Unique violation
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'IP address already highlighted' });
    }
    next(err);
  }
}

async function getHighlightedIp(req, res, next) {
  try {
    const record = await svc.getHighlightedIpById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Successfully retrieved data', data: record });
  } catch (err) {
    next(err);
  }
}

async function updateHighlightedIp(req, res, next) {
  try {
    const record = await svc.updateHighlightedIp(req.params.id, req.body);
    if (!record) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Updated successfully', data: record });
  } catch (err) {
    next(err);
  }
}

async function deleteHighlightedIp(req, res, next) {
  try {
    const record = await svc.deleteHighlightedIp(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Deleted successfully', data: record });
  } catch (err) {
    next(err);
  }
}

async function getActivity(req, res, next) {
  try {
    const { page = 1, limit = 20, sort } = req.query;
    const result = await svc.getActivityForHighlightedIps({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
    });
    return res.json({
      success: true,
      message: 'Successfully retrieved data',
      meta: { total_data: result.total },
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listHighlightedIps,
  createHighlightedIp,
  getHighlightedIp,
  updateHighlightedIp,
  deleteHighlightedIp,
  getActivity,
};
