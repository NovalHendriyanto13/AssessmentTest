import express from 'express';
import * as productController from '../../app/controllers/api/products.controller.js';

const router = express.Router();

router.get('/search', productController.listSearch);

export default router;