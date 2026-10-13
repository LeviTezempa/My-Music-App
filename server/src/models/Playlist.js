// links playlist directly to the creating user.
// My playlist database

const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true }, // Unified track identifier
  title: { type: String, required: true },
  artist: { type: String, required: true },
  artwork: { type: String },
  addedAt: { type: Date, default: Date.now }
});

const PlaylistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  tracks: [TrackSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
