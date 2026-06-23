const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

console.log('🚀 Starting COMSATS Resource Hub Backend...');
console.log('📦 Loading dependencies...');

dotenv.config();

console.log('🔧 Environment loaded');
console.log('  - PORT:', process.env.PORT || 5000);
console.log('  - NODE_ENV:', process.env.NODE_ENV);

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const pastPaperRoutes = require('./routes/pastPaperRoutes');
const forumRoutes = require('./routes/forumRoutes');
const gpaRoutes = require('./routes/gpaRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

console.log('🗄️ Connecting to database...');
connectDB().then(() => {
  console.log('✅ Database connection initiated');
}).catch(err => {
  console.error('❌ Database connection error:', err);
});

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

console.log('🔧 Configuring middleware...');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

console.log('🔌 Setting up Socket.io...');
io.on('connection', (socket) => {
  console.log('🔌 New WebSocket connection:', socket.id);
  
  socket.on('join_room', (room) => {
    console.log(`👥 User ${socket.id} joined room: ${room}`);
    socket.join(room);
  });

  socket.on('send_message', (data) => {
    console.log('💬 Message received:', data);
    io.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

console.log('🛣️ Setting up API routes...');

app.get('/', (req, res) => {
  res.json({
    name: 'COMSATS University Resource Hub API',
    version: '1.0.0',
    status: 'online',
    uptime: process.uptime()
  });
});

// Add console.log to track API calls
app.use((req, res, next) => {
  console.log('📥 Incoming request:', req.method, req.url);
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/pastpapers', pastPaperRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/gpa', gpaRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Global Error Middleware as requested
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:');
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log('\n✅ Backend server is running!');
  console.log(`   📡 API: http://localhost:${PORT}`);
  console.log(`   📂 Uploads: http://localhost:${PORT}/uploads`);
  console.log(`   🌍 Environment: ${process.env.NODE_ENV}`);
  console.log('\n🚀 Server is ready to accept connections!');
});
