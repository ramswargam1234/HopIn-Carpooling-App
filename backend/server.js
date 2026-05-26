require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const userRoutes = require('./routes/user.routes');
const rideRoutes = require('./routes/ride.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || '*', methods: ['GET', 'POST'] },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

// DB
connectDB();

// Routes
app.get('/', (req, res) => res.json({ message: 'HopIn API running' }));
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);

// Socket.IO: simple ride-room chat / status updates
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-ride', (rideId) => {
    socket.join(`ride:${rideId}`);
  });

  socket.on('chat-message', ({ rideId, from, text }) => {
    io.to(`ride:${rideId}`).emit('chat-message', {
      from,
      text,
      at: new Date().toISOString(),
    });
  });

  socket.on('ride-status', ({ rideId, status }) => {
    io.to(`ride:${rideId}`).emit('ride-status', { status });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`HopIn API on port ${PORT}`));
