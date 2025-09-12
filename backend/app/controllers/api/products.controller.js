import db from "../../../models/index.js"

import { Op } from "sequelize";

export async function listSearch(req, res) {
    try {
        const {
            search = ''
        } = req.query;

        const page = parseInt(req.query.page) || 1;
        const page_item = parseInt(req.query.page_item) || 10;

        const offset = (page - 1) * page_item;

        const products = await db.products.findAll({
            limit: page_item,
            offset,
            where: {
                product_name: {
                    [Op.like]: `%${search}%`
                }
            }
        });
        
        res.status(201).json({
            status: true,
            statusCode: 200,
            data: products,
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