const WebSocket = require('ws');
const server = new WebSocket.Server({
  port: 8080,
});

let sockets = [];
let queue = null;

server.on('connection', (socket) => {
  sockets.push(socket);

  socket.on('message', (message) => {
    const data = JSON.parse(message.toString());
    let result;
    if (data.activity === 'start') {
      if (queue === null) {
        queue = message.toString();
        result = message.toString();
      }
    } else {
      if (queue !== null) queue = null;
      result = message.toString();
    }
    sockets.forEach((s) => s.send(result));
  });

  socket.on('close', () => {
    sockets = sockets.filter((s) => s !== socket);
  });
});
