// Automatically clears the catch after 7days.

const mongoose = require('mongoose');

const TrackCacheSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  youtubeId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // Automatically clear after 7 days to keep it fresh
});

module.exports = mongoose.model('TrackCache', TrackCacheSchema);
