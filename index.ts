import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { app_config } from './configs/app.config';
import indexRoute from './routes';
import { scheduleBirthday } from './app/commands/birthday.cron';

const app = express();
const port = app_config.app_port;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb' }));

app.use("/api", indexRoute);

mongoose.connect(app_config.mongo_uri!).then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => console.log(`Server running on port ${port}`));
  scheduleBirthday();
  
}).catch(err => console.error('MongoDB connection error:', err));
