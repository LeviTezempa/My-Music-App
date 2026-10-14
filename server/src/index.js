
// Fires up my listening systems.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const musicRoutes = require('./routes/music'); 
const authRoutes = require('./routes/auth');
const playlistRoutes = require('./routes/playlists.routes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Database connection error:', err));

// 2. Setup Routes API Prefix
app.use('/api/music', musicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/playlist.routes', playlistRoutes); // Bind playlist routes

app.get('/', (req, res) => {
  res.send('Music App Backend Server is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server operating cleanly on port ${PORT}`);
});
