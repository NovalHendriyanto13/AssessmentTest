import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import {
  Container,
  Form,
  Button,
  Alert,
  ListGroup,
  Stack,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createInvoice } from "../features/invoice.feature";
import { fetch, clearProducts } from "../features/product.feature";
import { toast } from "react-toastify";

export default function AddInvoice() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil product list dari Redux
  const products = useSelector((state) => state.product.products || []);

  const [query, setQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Tambah product ke list
  const addProduct = (product) => {
    if (!selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setQuery('');
    dispatch(clearProducts());
  };

  // Submit invoice ke API
  const onSubmit = (data) => {
    if (selectedProducts.length === 0) {
      toast.warning("Please add at least one product");
      return;
    }

    const product = selectedProducts.map((p) => {
        return {
            product_id: p.id,
            price: p.price
        }
    })
    dispatch(createInvoice({ ...data, products: product }))
      .unwrap()
      .then(() => {
        toast.success("Invoice created successfully!");
        navigate("/");
      })
      .catch((err) => toast.error(err.message || "Failed to create invoice"));
  };

  // Cari produk dengan minimal 3 karakter
  const searchProduct = (text) => {
    setQuery(text);
    dispatch(clearProducts());
    if (text.length > 3) {
      dispatch(fetch({ search: text }));
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Add Invoice</h2>
      <Form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow-sm bg-white">
        {/* Invoice Date */}
        <Form.Group className="mb-3">
          <Form.Label>Invoice Date</Form.Label>
          <Form.Control
            type="date"
            {...register("invoice_date", { required: true })}
            isInvalid={!!errors.invoice_date}
          />
          <Form.Control.Feedback type="invalid">
            Invoice date is required
          </Form.Control.Feedback>
        </Form.Group>

        {/* Customer Name */}
        <Form.Group className="mb-3">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter customer name"
            {...register("customer_name", { required: true })}
            isInvalid={!!errors.customer_name}
          />
          <Form.Control.Feedback type="invalid">
            Customer name is required
          </Form.Control.Feedback>
        </Form.Group>

        {/* Salesperson */}
        <Form.Group className="mb-3">
          <Form.Label>Salesperson</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter salesperson name"
            {...register("sales_person", { required: true })}
            isInvalid={!!errors.sales_person}
          />
          <Form.Control.Feedback type="invalid">
            Salesperson is required
          </Form.Control.Feedback>
        </Form.Group>

        {/* Notes */}
        <Form.Group className="mb-3">
          <Form.Label>Notes</Form.Label>
          <Form.Control
            type="text"
            placeholder="Optional notes"
            {...register("notes")}
          />
        </Form.Group>

        {/* Product Search */}
        <Form.Group className="mb-3">
          <Form.Label>Search Product</Form.Label>
          <Form.Control
            type="text"
            value={query}
            placeholder="Search product"
            onChange={(e) => searchProduct(e.target.value)}
          />
          {query && products.length > 0 && (
            <ListGroup className="mt-2">
              {products.map((product) => (
                <ListGroup.Item
                  key={product.id}
                  action
                  onClick={() => addProduct(product)}
                >
                  {product.product_name} — ${product.price}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        {/* Selected Products */}
        <div className="mb-3">
          <h5>Selected Products:</h5>
          {selectedProducts.length === 0 && (
            <Alert variant="secondary">No products selected</Alert>
          )}
          <ListGroup>
            {selectedProducts.map((p) => (
              <ListGroup.Item key={p.id}>
                {p.product_name} — ${p.price}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* Submit & Back */}
        <Stack direction="horizontal" gap={3} className="mb-5">
          <Button type="submit" variant="primary">
            Submit Invoice
          </Button>
          <div className="vr" />
          <Button
            variant="outline-danger"
            onClick={() => navigate("/")}
          >
            Back
          </Button>
        </Stack>
      </Form>
    </Container>
  );
}
