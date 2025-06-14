require('dotenv').config();

export const app_config = {
    app_port: process.env.APP_PORT || 3000,
    sdt_email_base_api: process.env.SDT_EMAIL_BASE_API || '',
    mongo_uri: process.env.MONGO_URI || ''
} 