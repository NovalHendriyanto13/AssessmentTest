const { Router } = require('express');
const { query } = require('express-validator');
const { listAlerts } = require('../controllers/alertController');
const { validate } = require('../middleware/validate');

const router = Router();

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1–100'),
    query('sort').optional().isIn(['asc', 'desc']).withMessage('sort must be asc or desc'),
  ],
  validate,
  listAlerts
);

module.exports = router;
