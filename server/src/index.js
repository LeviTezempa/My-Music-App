
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const musicRoutes = require('./routes/music');
const authRoutes = require('./routes/auth');
const playlistRoutes = require('./routes/playlists.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/music', musicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);

app.get('/', (req, res) => {
  res.send('Music App Backend Server is Running!');
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required to start the server');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected successfully');

  app.listen(PORT, () => {
    console.log(`Server operating cleanly on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start server:', error.message);
  process.exitCode = 1;
});
