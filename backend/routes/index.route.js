import express from 'express';
import invoiceRoute from './invoices/invoice.route.js';
import productRoute from './products/product.route.js';

const routes = express.Router();

routes.use('/invoices', invoiceRoute);
routes.use('/products', productRoute);

export default routes;