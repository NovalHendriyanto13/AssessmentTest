import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import apiHelper from "../helpers/api.helper";

export const fetchInvoice = createAsyncThunk(
    "invoices/fetchInvoice",
    async ({ page = 1, page_item = 10 }) => {
        return apiHelper.get(`invoices?page=${page}&page_item=${page_item}`)
    }
)

export const createInvoice = createAsyncThunk(
    "invoices/createInvoice",
    async (invoice) => {
        return apiHelper.post('invoices', invoice)
    }
)

const invoiceSlicer = createSlice({
    name: "invoices",
    initialState: {
        invoices: [],
        status: 0,
        error: null,
        page: 1
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoice.pending, (state) => {
                state.status = 1
            })
            .addCase(fetchInvoice.fulfilled, (state, action) => {
                state.status = 2
                state.invoices.push(...action.payload?.data?.data)
                state.page +=1
            })
            .addCase(fetchInvoice.rejected, (state, action) => {
                state.status = 4;
                state.error = action.error.message;
            })
            .addCase(createInvoice.fulfilled, (state, action) => {
                state.invoices.unshift(action.payload); // add to top
            });
    }
})

export default invoiceSlicer.reducer;
