import express from "express";
import birthdayRoute from "./birthdays/index.route";
import commonRoute from "./commons/common.route"

const router = express.Router();

router.use("/birth-day", birthdayRoute);
router.use("/common", commonRoute);

export default router;