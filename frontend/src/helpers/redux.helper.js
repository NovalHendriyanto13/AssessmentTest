import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from '../features/invoice.feature';
import productReducer from '../features/product.feature';
import chartReducer from '../features/chart.feature';

export const reduxHelper = configureStore({
    reducer: {
        invoice: invoiceReducer,
        product: productReducer,
        dashboard: chartReducer,
    }
})