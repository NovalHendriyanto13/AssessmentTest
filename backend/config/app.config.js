import dotenv from "dotenv";

dotenv.config();

export default {
    app_port: process.env.APP_PORT || 8000,
}