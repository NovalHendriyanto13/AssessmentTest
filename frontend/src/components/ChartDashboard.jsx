import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Brush
} from "recharts";
import { aggregateRevenue } from "../helpers/common.helper";
import { fetchInvoice } from "../features/chart.feature";

export default function ChartDahboard() {
  const dispatch = useDispatch();
  const invoices = useSelector(state => state.dashboard?.data || []);
  const status = useSelector(state => state.dashboard?.status || 0);
  const [period, setPeriod] = useState("daily");
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (status === 0) dispatch(fetchInvoice({range_time: period}));

    const data = aggregateRevenue(invoices, period);
    setGraphData(data);
    console.log(graphData);
  }, [invoices, period, dispatch]);

  return (
    <div>
      <h3>Revenue Graph</h3>
      <select value={period} onChange={e => setPeriod(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="revenue"/>
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" dot={false} />
          <Brush dataKey="date" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
