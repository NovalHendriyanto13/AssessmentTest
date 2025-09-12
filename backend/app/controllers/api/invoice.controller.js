import db from "../../../models/index.js"
import { randomString } from "../../helpers/common.helper.js";

export async function create(req, res) {
    try {
        const {
            invoice_date, sales_person, notes, products
        } = req.body;

        const invoice_id = randomString();
        const total = products.reduce((sum, p) => sum + p.price, 0);

        const data = await db.invoices.create({
            invoice_id,
            invoice_date,
            sales_person,
            notes,
            total,
        });

        const productPayload = products.map((p) => {
            return {...p, 
                invoice_id: data.id,
            }
        })

        const lines = await db.invoice_lines.bulkCreate(productPayload);

        res.status(201).json({
            status: true,
            statusCode: 200,
            data,
            message: "Create Data is sucess",
        });
    } catch (err) {
        console.error(err);
        res.status(201).json({
            status: false,
            statusCode: 500,
            data: null,
            message: "Failed to create invoice",
        });
    }
}

export async function list(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const page_item = parseInt(req.query.page_item) || 10;

        const offset = (page - 1) * page_item;

        const invoices = await db.invoices.findAll({
            limit: page_item,
            offset,
        });

        const totalPages = Math.ceil((invoices.length) / page_item);
        
        const data = {
            data: invoices,
            totalItems: invoices.length,
            totalPages: totalPages,
            currentPage: page,
            pageSize: page_item,
        }
        res.status(201).json({
            status: true,
            statusCode: 200,
            data,
            message: "Get Data is sucess",
        });
    } catch (err) {
        console.error(err);
        res.status(201).json({
            status: false,
            statusCode: 500,
            data: null,
            message: "Failed to Get invoice",
        });
    }
}

export async function chart(req, res) {
    try {
        const { range_time } = req.query;

        const invoices = await db.invoices.findAll();
       
        const data = {
            data: invoices,
        }
        res.status(201).json({
            status: true,
            statusCode: 200,
            data,
            message: "Get Data is sucess",
        });
    } catch (err) {
        console.error(err);
        res.status(201).json({
            status: false,
            statusCode: 500,
            data: null,
            message: "Failed to Get invoice",
        });
    }
}