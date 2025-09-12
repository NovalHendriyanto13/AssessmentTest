import React from "react";
import AddInvoice from "../components/AddInvoice";
import InvoiceCard from "../components/InvoiceCard";
import InvoiceTable from "../components/InvoiceTable";

export default function Invoice() {
    return (
        <div className="space-y-8 p-4">
            <section>
                <h2>Add Invoice</h2>
                <AddInvoice />
            </section>
            <section>
                <h2>Invoice List</h2>
                <InvoiceTable />
            </section>
        </div>
    )
}