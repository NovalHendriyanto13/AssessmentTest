const { Router } = require('express');
const { body, param, query } = require('express-validator');
const ctrl = require('../controllers/highlightedIpController');
const { validate } = require('../middleware/validate');

const router = Router();

const ipValidation = [
  body('ip_address')
    .notEmpty().withMessage('ip_address is required')
    .isIP().withMessage('ip_address must be a valid IP address'),
  body('label').optional().isString().trim(),
  body('reason').optional().isString().trim(),
];

const patchValidation = [
  body('ip_address').optional().isIP().withMessage('ip_address must be a valid IP address'),
  body('label').optional().isString().trim(),
  body('reason').optional().isString().trim(),
];

const idParam = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
];

// CRUD
router.get('/', ctrl.listHighlightedIps);
router.post('/', ipValidation, validate, ctrl.createHighlightedIp);
router.get('/:id', idParam, validate, ctrl.getHighlightedIp);
router.put('/:id', [...idParam, ...ipValidation], validate, ctrl.updateHighlightedIp);
router.patch('/:id', [...idParam, ...patchValidation], validate, ctrl.updateHighlightedIp);
router.delete('/:id', idParam, validate, ctrl.deleteHighlightedIp);

router.get('/activity/logs', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isIn(['asc', 'desc']),
], validate, ctrl.getActivity);

module.exports = router;
