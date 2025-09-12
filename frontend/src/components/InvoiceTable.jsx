import React, { useEffect } from "react";
import Container from "react-bootstrap/Container"
import { Col, Row, Card, Stack, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInvoice } from "../features/invoice.feature";
import AddInvoice from "./AddInvoice";

export default function InvoiceTable() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const invoices = useSelector( state => state.invoice?.invoices || [])
    const page = useSelector( state => state.invoice?.page || 1)
    const status = useSelector( state => state.invoice?.status || 0)

    useEffect(() => {
        if (status ===0) dispatch(fetchInvoice({page: 1, page_item: 5}))
    }, [dispatch])

    const loadMore = () => dispatch(fetchInvoice(page, { page_item: 5}))

    return (
        <Container>
            <Stack direction="horizontal" gap={3} className="mb-5">
                <h2 className="me-auto">Invoices</h2>
                <Button 
                    variant="secondary"
                    onClick={ () => navigate('/add-invoice')}
                >
                        Add Invoice
                </Button>
                <div className="vr" />
                <Button variant="outline-danger"
                    onClick={ () => navigate('/dashboard')}
                >Dashbord</Button>
            </Stack>
            <Row>
                {invoices.map((inv) => {
                    const total = inv.products?.reduce((a, b) => a + b.price, 0) || 0;
                    const invoiceDate = new Date(inv.invoice_date).toDateString()
                    return (
                        <Col>
                            <Card style={{ width: '20rem'}} className="m-2">
                                <Card.Body>
                                    <Card.Title>#{inv.invoice_id}</Card.Title>
                                    <Card.Subtitle>
                                        <p>Date : {invoiceDate}</p>
                                        <p>Sales Person: {inv.sales_person}</p>
                                    </Card.Subtitle>
                                    <Card.Text>{inv.notes}</Card.Text>
                                    <Card.Link href="#">Card Link</Card.Link>
                                    <Card.Link href="#">Another Link</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    )
}