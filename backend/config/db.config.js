import dotenv from 'dotenv';

dotenv.config();

export default {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    db_name: process.env.DB_NAME,
    db_port: process.env.DB_PORT || 3306,
    db_username: process.env.DB_USERNAME || 'root',
    db_password: process.env.DB_PASSWORD
}