import { Server } from 'ws';

let clients = [];

export default function handler(req, res) {
  if (!res.socket.server.wss) {
    const wss = new Server({ server: res.socket.server });
    wss.on('connection', ws => {
      clients.push(ws);
      ws.on('message', msg => {
        clients.forEach(client => {
          if (client.readyState === 1) client.send(msg.toString());
        });
      });
      ws.on('close', () => {
        clients = clients.filter(c => c !== ws);
      });
    });
    res.socket.server.wss = wss;
  }
  res.end();
}
