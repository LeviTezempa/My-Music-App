// Communicates with my APIs.

const axios = require('axios'); // Allows my data to fetch track data.
const TrackCache = require('../models/TrackCache');

// 1. Get Trending / Hype Tracks from Last.fm
exports.getNewReleases = async (req, res) => {
  try {
    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'chart.gettoptracks',
        api_key: process.env.LASTFM_API_KEY,
        format: 'json',
        limit: 20
      }
    });
    
    const items = response.data.tracks?.track || [];
    
    // Map data fields smoothly into our standard React schema
    const tracks = items.map((item, index) => ({
      spotifyId: `lastfm-${index}-${item.name.replace(/\s+/g, '-').toLowerCase()}`, // Unique fallback ID for keys
      title: item.name,
      artist: item.artist?.name || 'Unknown Artist',
      artwork: item.image?.[2]?.['#text'] || 'https://placehold.co', // Fallback artwork frame
      releaseDate: 'Trending Now'
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Last.fm error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending music' });
  }
};

// 2. Resolve Track to YouTube Video ID (Remains identical to protect your quota!)
exports.resolveTrack = async (req, res) => {
  const { spotifyId, title, artist } = req.query;

  if (!spotifyId || !title || !artist) {
    return res.status(400).json({ error: 'Missing track parameters' });
  }

  try {
    const cachedTrack = await TrackCache.findOne({ spotifyId });
    if (cachedTrack) {
      return res.json({ youtubeId: cachedTrack.youtubeId, source: 'cache' });
    }

    const searchQuery = encodeURIComponent(`${artist} - ${title} official audio`);
    const ytResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${artist} - ${title} official audio`,
        type: 'video',
        maxResults: 1,
        key: process.env.YOUTUBE_API_KEY
      }
    });
    const youtubeId = ytResponse.data.items?.[0]?.id?.videoId;

    if (!youtubeId) {
      return res.status(404).json({ error: 'Song not found on YouTube' });
    }

    await TrackCache.create({ spotifyId, title, artist, youtubeId });

    res.json({ youtubeId, source: 'youtube_api' });
  } catch (error) {
    console.error('Resolve Error:', error.message);
    res.status(500).json({ error: 'Failed to resolve streaming track' });
  }
};
