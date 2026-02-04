import { WebSocketServer } from 'ws';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());

const wss = new WebSocketServer({ port: 9000 });
const clients = new Map();

wss.on('connection', (ws) => {
  let clientId = null;

  ws.on('message', (msg) => {
    if (!clientId) {
      clientId = msg.toString();
      clients.set(clientId, ws);
      console.log(`Client connected: ${clientId}`);
      return;
    }

    if (msg.toString() === 'START_FILE') {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const filePath = path.join(__dirname, `${clientId}.txt`);
      console.log(filePath);
      const writeStream = fs.createWriteStream(filePath);

      ws.on('message', (chunk) => {
        if (chunk.toString() === 'EOF') {
          writeStream.end();
          console.log(`File received from ${clientId}`);
        } else {
          writeStream.write(chunk);
        }
      });
    }
  });

  ws.on('close', () => {
    if (clientId) clients.delete(clientId);
  });
});

app.post('/download/:clientId', (req, res) => {
  const clientId = req.params.clientId;
  const ws = clients.get(clientId);

  if (!ws) {
    return res.status(404).json({ error: 'Client not connected' });
  }

  ws.send('SEND_FILE');
  res.json({ status: 'Download triggered' });
});

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
  console.log('WebSocket on ws://localhost:9000');
});
