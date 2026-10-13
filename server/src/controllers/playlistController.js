// Handles the CRUD operations of my playlist for user collection.

const Playlist = require('../models/Playlist');

// Get all playlist belonging to the logged-in user
exports.getUserPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.userId }).select('name tracks.length createdAt');
        res.json(Playlists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve playlists'});
    } 
};

// Creates a new empty playlist
exports.createPlaylist = async (req, res) => {
    const {name} = req.body;
    //
}