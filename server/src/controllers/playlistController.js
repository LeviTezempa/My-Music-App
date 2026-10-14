// Handles the CRUD operations of my playlist for user collection.

const Playlist = require('../models/Playlist');

// Get all playlist belonging to the logged-in user
exports.getUserPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.userId }).select('name tracks.length createdAt');
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve playlists'});
    } 
};

// Creates a new empty playlist
exports.createPlaylist = async (req, res) => {
    const {name} = req.body;
    if (!name) return res.status(400).json({ error: 'Playlist name is required' });

    try {
        const newPlaylist = new Playlist({ userId: req.userId, name, tracks: [] });
        await newPlaylist.save();
        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create playlist' });
    }
};

// Get individual playlist details with full track listings
exports.getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.userId });
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch playlist items' });
    }
};

// Add a track to a specific playlist
exports.addTrackToPlaylist = async (req, res) => {
    const { spotifyId, title, artist, artwork } = req.body;

    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.userId });
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

        // Prevent duplicate track profiles inside the same playlist
        const alreadyExists = playlist.tracks.some(track => track.spotifyId === spotifyId);
        if (alreadyExists) return res.status(400).json({ error: 'Track already inside this playlist' });

        playlist.tracks.push({ spotifyId, title, artist, artwork });
        await playlist.save();

        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add track' });
    }
};

// Removes a track from a playlist
exports.removeTrackFromPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.userId });
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

        playlist.tracks = playlist.tracks.filter(track => track._id.toString() !== req.params.trackId);
        await playlist.save();

        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove track'});
    }
};