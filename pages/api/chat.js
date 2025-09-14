import { Server } from 'ws';

let clients = [];

export default function handler(req, res) {
  if (!res.socket.server.wss) {
    const wss = new Server({ server: res.socket.server });
    wss.on('connection', ws => {
      clients.push(ws);
      
      // Send a welcome message
      const welcomeMessage = {
        text: "Welcome to the chat room! Start typing to send messages.",
        timestamp: new Date().toISOString(),
        id: `system-${Date.now()}`
      };
      ws.send(JSON.stringify(welcomeMessage));

      ws.on('message', data => {
        try {
          // Parse the message data
          const message = JSON.parse(data.toString());
          
          // Broadcast to all connected clients
          clients.forEach(client => {
            if (client.readyState === 1) {
              client.send(JSON.stringify(message));
            }
          });
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('close', () => {
        clients = clients.filter(c => c !== ws);
      });
    });
    res.socket.server.wss = wss;
  }
  res.end();
}
