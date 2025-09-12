import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import apiHelper from "../helpers/api.helper";

const initialState = {
  data: [],
  status: 0,
};

export const fetchInvoice = createAsyncThunk(
    "chart/fetchInvoice",
    async ({ range_time = 'daily' }) => {
        return apiHelper.get(`invoices/chart?range_time=${range_time}`)
    }
)

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    setChartData: (state, action) => {
    //   state.data = action.payload;
    },
    pushChart: (state, action) => {
    //   state.data.push(action.payload);
    }, 
  },
  extraReducers: (builder) => {
        builder
            .addCase(fetchInvoice.pending, (state) => {
                state.status = 1
            })
            .addCase(fetchInvoice.fulfilled, (state, action) => {
                state.status = 2
                const data = action.payload?.data?.data.map((e) => {
                    return {
                        date: e.invoice_date,
                        revenue: e.total
                    }
                })
                state.data.push(...data)
                state.page +=1
            })
            .addCase(fetchInvoice.rejected, (state, action) => {
                state.status = 4;
                state.error = action.error.message;
            });
    }
});

export const { setChartData, pushChart } = chartSlice.actions;
export default chartSlice.reducer;
