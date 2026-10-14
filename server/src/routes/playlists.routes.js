// 

const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const authMiddleware = require('../middleware/authMiddleware');

// Secure all endpoints below with our login guard token checker
router.use(authMiddleware);

router.get('/', playlistController.getUserPlaylists);
router.post('/', playlistController.createPlaylist);
router.get('/:id', playlistController.getPlaylistById);
router.post('/:id/tracks', playlistController.addTrackToPlaylist);
router.delete('/:id/tracks/:trackId', playlistController.removeTrackFromPlaylist);

module.exports = router;