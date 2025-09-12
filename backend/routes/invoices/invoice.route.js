import express from 'express';
import * as invoiceController from '../../app/controllers/api/invoice.controller.js';

const router = express.Router();

router.post('/', invoiceController.create);
router.get('/', invoiceController.list);
router.get('/chart', invoiceController.chart);

export default router;