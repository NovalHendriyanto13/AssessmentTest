import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import apiHelper from "../helpers/api.helper";

export const fetch = createAsyncThunk(
    "product/fetch",
    async ({ page = 1, page_item = 10, search = '' }) => {
        return apiHelper.get(`products/search?page=${page}&page_item=${page_item}&search=${search}`)
    }
)

const productSlicer = createSlice({
    name: "product",
    initialState: {
        products: [],
        status: 0,
        error: null,
        page: 1
    },
    reducers: {
        clearProducts: (state) => {
            state.products = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch.pending, (state) => {
                state.status = 1
            })
            .addCase(fetch.fulfilled, (state, action) => {
                state.status = 2
                state.products.push(...action.payload.data)
                state.page +=1
            })
            .addCase(fetch.rejected, (state, action) => {
                state.status = 4;
                state.error = action.error.message;
            });
    }
})

export const { clearProducts } = productSlicer.actions;
export default productSlicer.reducer;
