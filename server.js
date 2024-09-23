const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost:27017/ticketsystem'; // For local MongoDB
// or
// const mongoUri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/ticketmanagement?retryWrites=true&w=majority'; // For MongoDB Atlas

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));


const jsonServer = require('json-server');
const auth = require('json-server-auth');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const http = require('http');
//const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create JSON Server
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const secretKey = 'd9ac05c06aa4108ab2dfc4a93c4f237c2b521b905e720c7a9a8ba42cf4b6f2e';
server.use(cors({
  origin: 'http://localhost:4200', // Angular frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // Allow credentials to be included
}));

server.db = router.db;
server.use(middlewares);
server.use(bodyParser.json());
server.use(jsonServer.bodyParser);
 server.use(auth);

let tickets = [];

// Middleware to check authorization token
function checkToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], secretKey);
    if (decoded) {
      req.user = decoded;
      next(); // Token is valid, proceed to the next middleware
    } else {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

// Middleware to check if user is admin
function checkAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden - Admins only' });
  }
  next();
}

// Middleware for centralized error handling
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
}

server.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = router.db.get('users').find({ email }).value();

  if (!user) {
    return res.status(401).json({ error: 'Email does not exist', userId: null });
  }

  if (user.isLocked) {
    return res.status(403).json({ error: 'Account is locked. Please contact support.', userId: user.id });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (isPasswordMatch) {
    router.db.get('users').find({ email }).assign({ failedAttempts: 0 }).write();
    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
    return res.json({ message: 'Login successful', token, user: { id: user.id, role: user.role } });
  } else {
    let failedAttempts = user.failedAttempts + 1;
    let isLocked = failedAttempts >= 5;
    router.db.get('users').find({ email }).assign({ failedAttempts, isLocked }).write();
    if (isLocked) {
      return res.status(403).json({ error: 'Account locked due to too many failed attempts', userId: user.id });
    }
    return res.status(401).json({ error: 'Invalid credentials', userId: user.id });
  }
});

server.post('/register', async (req, res) => {
  const { email, password, ...rest } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { email, password: hashedPassword, failedAttempts: 0, isLocked: false, ...rest };
  router.db.get('users').push(user).write();
  res.status(201).json({ message: 'User registered successfully' });
});




server.get('/users', checkToken, (req, res, next) => {
  try {
    const users = router.db.get('users').value();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

server.delete('/api/users/:id', (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const user = router.db.get('users').find({ id: userId }).value();
    if (user) {
      router.db.get('users').remove({ id: userId }).write();
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

server.patch('/users/:id/personal-details', checkToken, (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { fatherName, age, dob } = req.body;

    const user = router.db.get('users').find({ id: userId }).value();
    if (user) {
      router.db.get('users').find({ id: userId }).assign({ fatherName, age, dob }).write();
      res.status(200).json({ message: 'Personal details updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

server.post('/audit-log', (req, res, next) => {
  try {
    const { action, userId, timestamp } = req.body;

    if (!action || !userId || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields (action, userId, timestamp)' });
    }

    const logEntry = { action, userId, timestamp };
    const auditLog = router.db.get('auditLog');
    auditLog.push(logEntry).write();

    res.status(201).json(logEntry);
  } catch (error) {
    next(error);
  }
});


server.get('/audit-logs', checkToken, (req, res, next) => {
  try {
    // Retrieve audit logs from JSON Server database
    let auditLogs = router.db.get('auditLog').value();

    // Sort audit logs by timestamp in descending order
    auditLogs.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    // Send sorted audit logs as JSON response
    res.json(auditLogs);
  } catch (error) {
    next(error);
  }
});
//Tickets genration and viewing and Updating API'S

// Get tickets by user ID
server.get('/tickets', (req, res) => {
  const tickets = router.db.get('tickets').value();
  res.json(tickets);
});

server.get('/tickets/:ticketId', (req, res) => {
  const ticketId = parseInt(req.params.ticketId, 10);
  const ticket = router.db.get('tickets').find({ id: ticketId }).value();
  if (ticket) {
    res.json(ticket);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

server.post('/tickets', (req, res) => {
  const newTicket = req.body;
  router.db.get('tickets').push(newTicket).write();
  res.status(201).json(newTicket);
});

// Custom route for adding a message to a ticket
server.patch('/tickets/:id', (req, res) => {
  const ticketId = req.params.id;
  const newMessage = req.body.messages[0];

  const db = router.db; // Get the lowdb instance
  const ticket = db.get('tickets').find({ id: Number(ticketId) }).value();

  if (ticket) {
    ticket.messages.push(newMessage);
    db.get('tickets').find({ id: Number(ticketId) }).assign(ticket).write();
    res.status(200).json(ticket);
  } else {
    res.status(404).json({ message: 'Ticket not found' });
  }
});

server.post('/tickets/:ticketId/messages', (req, res) => {
  const ticketId = parseInt(req.params.ticketId, 10);
  const message = req.body;

  const ticket = router.db.get('tickets').find({ id: ticketId }).value();
  if (ticket) {
    if (!ticket.messages) {
      ticket.messages = [];
    }
    ticket.messages.push(message);
    router.db.get('tickets').find({ id: ticketId }).assign(ticket).write();

   // io.emit(`ticket_${ticketId}`, ticket);  // Broadcast message to all clients

    res.status(200).json(ticket);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});



server.patch('/tickets/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === 'Cancelled') {
    const db = router.db; // LowDB instance
    const ticket = db.get('tickets').find({ id: Number(id) }).value();

    if (ticket) {
      db.get('tickets')
        .find({ id: Number(id) })
        .assign({ status: 'Cancelled', statusUpdatedAt: new Date().toISOString() })
        .write();

      res.status(200).json({ message: `Ticket with ID ${id} has been cancelled.` });
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } else {
    res.status(400).json({ error: 'Invalid status update' });
  }
});


// Use the error handling middleware
server.use(errorHandler);
server.use(router);

// Ensure error handling middleware is at the end
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server and Socket.IO are running on http://localhost:${port}`);
});