import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoice } from "../features/invoice.feature";

export default function InvoiceCard() {
  const dispatch = useDispatch();
  const invoices = useSelector(state => state.invoice?.invoices || []);
  const status = useSelector(state => state.invoice?.status || 0);
  const page = useSelector(state => state.invoice?.page || 1);

  useEffect(() => {
    if (status === 0) dispatch(fetchInvoice({page:1, limit:5}));
  }, [dispatch]);

  const loadMore = () => dispatch(fetchInvoice({page, limit:5}));

  return (
    <div>
      {invoices.map((inv, i) => (
        <div key={i} className="border p-2 my-2">
          <p>{inv.invoice_date} - {inv.sales_person}</p>
          {/* <p>Total: {inv.products.reduce((a,b)=> a+b.price, 0)}</p> */}
        </div>
      ))}
      <button onClick={loadMore}>Load More</button>
    </div>
  );
}
