import { WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CLIENT_ID = 'client-00112233';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.join(__dirname, `${CLIENT_ID}.txt`);
const SERVER_URL = 'ws://localhost:9000';

const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  ws.send(CLIENT_ID);
  console.log('Connected');
});

ws.on('message', (msg) => {
  if (msg.toString() === 'SEND_FILE') {
    console.log('Sending file...');
    ws.send('START_FILE');

    const stream = fs.createReadStream(FILE_PATH);
    stream.on('data', chunk => ws.send(chunk));
    stream.on('end', () => ws.send('EOF'));
  }
});
