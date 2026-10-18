const express = require('express');
const musicController = require('../controllers/musicContoller');

const router = express.Router();

router.get('/new-releases', musicController.getNewReleases);
router.get('/search', musicController.searchTracks);
router.get('/resolve', musicController.resolveTrack);

module.exports = router;
