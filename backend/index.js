import express from 'express';
import cors from 'cors';
import os from 'os';
import appConfig from './config/app.config.js';
import routes from './routes/index.route.js';

const app = express();
const port = appConfig.app_port || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getWSLIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // ambil hanya IPv4 non-internal (bukan 127.0.0.1)
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

app.get('/', (req, res) => {
    res.send('ala');
})
app.use('/api', routes);

app.listen(port, '0.0.0.0', () => {
    const ip = getWSLIP();
    console.log(`✅ Server running`);
    console.log(`- Local:     http://localhost:${port}`);
    console.log(`- WSL IP:    http://${ip}:${port}`);
});