// backend/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import User from './models/User.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Game state
const rooms = {}; // { roomId: { players: [{id, name, socketId}], gameState: 'waiting'|'playing'|'finished' } }

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('User connected:', socket.userId);
  
  try {
    const user = await User.findById(socket.userId);
    if (!user) {
      socket.disconnect();
      return;
    }
    
    socket.user = { id: user._id, name: user.name, email: user.email };
    
    // Send welcome message
    socket.emit('welcome', `Welcome to War, ${user.name}!`);
    
    // Handle joining a room
    socket.on('join_room', (roomId) => {
      if (!rooms[roomId]) {
        rooms[roomId] = { players: [], gameState: 'waiting' };
      }
      
      // Check if room is full (max 2 players for War)
      if (rooms[roomId].players.length >= 2) {
        socket.emit('room_full', 'Room is full');
        return;
      }
      
      // Add player to room
      const player = {
        id: socket.user.id,
        name: socket.user.name,
        socketId: socket.id
      };
      
      rooms[roomId].players.push(player);
      socket.join(roomId);
      
      // Broadcast updated player list
      io.to(roomId).emit('player_list', rooms[roomId].players);
      
      // If room is full, start the game
      if (rooms[roomId].players.length === 2) {
        rooms[roomId].gameState = 'playing';
        io.to(roomId).emit('game_start', 'Game starting!');
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.name);
      
      // Remove player from all rooms
      Object.keys(rooms).forEach(roomId => {
        const room = rooms[roomId];
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          io.to(roomId).emit('player_list', room.players);
          
          // If room becomes empty, delete it
          if (room.players.length === 0) {
            delete rooms[roomId];
          }
        }
      });
    });
    
  } catch (error) {
    console.error('Error handling connection:', error);
    socket.disconnect();
  }
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});


// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Signin route
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, email: user.email, name: user.name});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update /api/verify route
app.get('/api/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});