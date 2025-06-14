import express from "express";
import * as commonController from '../../app/controllers/api/common.controller';

const route = express.Router();

route.get('/timezone', commonController.getTimeZone);

export default route;
