// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const axios = require('axios'); // For REST API calls
// const cors = require('cors');  // Import cors
// const app = express();
// const server = http.createServer(app);
// // const io = socketIo(server);
// //const { Server } = require('socket.io');
// const API_URL = 'http://localhost:3000'; // REST API URL
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:4200', // Frontend URL
//     methods: ['GET', 'POST']
//   }
// });

// app.use(cors());

// io.on('connection', (socket) => {
//   console.log('New client connected',socket.id);

//   socket.on('sendMessage', async (data) => {
//     const { ticketId, message } = data;
//     console.log('Message received on server:', data);

//     try {
//       // Store message via REST API
//       await axios.post(`${API_URL}/tickets/${ticketId}/messages`, message);
//   // Broadcast message to all clients
//   io.emit('message-received', { ticketId, message });

//   // Optionally notify specific clients about ticket updates
//   io.emit('ticket-update', { ticketId });
//   console.log('Message sent and broadcasted:', message);
//     } catch (error) {
//       console.error('Error storing message:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// server.listen(3001, () => {
//   console.log('WebSocket server running on portsocket 3001');
// });
// var server =require('ws').Server;
// var s = new server({port:3001});
// s.on('connection',function(ws){
//   ws.on('message',function(message){
//     console.log("Received",+ message);
//   });
// });

const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    const decodedMessage = message.toString('utf8');
    console.log('Received:', decodedMessage);
    //socket.send('Hello from server');

     // Broadcast the message to all clients
     server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(decodedMessage);
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });

  socket.send('Connection established');
});

console.log('WebSocket server is running on ws://localhost:8080');
