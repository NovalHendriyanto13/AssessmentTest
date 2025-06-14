import axios from 'axios';
import { app_config } from '../../configs/app.config';

export async function sendEmail(emailBody: string, email: string) {
  try {    
    const res = await axios.post(app_config.sdt_email_base_api, {
      email,
      message: emailBody
    });
    console.log('email res', res);
    return res.status === 200;
  } catch (error: any) {
    console.error('Email send failed:', error.message);
    return false;
  }
}