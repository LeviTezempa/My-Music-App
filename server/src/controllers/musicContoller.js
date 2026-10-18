
const axios = require('axios');
const TrackCache = require('../models/TrackCache');

// Returns top 50 songs from iTunes/Youtube uploaded defaultly on my discover.
const TOP_SONGS_URL = 'https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/songs.json';
const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

// Converts low resolution artwork to a high quality image.
const getArtworkUrl = (url) => {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return null;
  return url.replace(/\/\d+x\d+bb(?=\.)/i, '/600x600bb');
};
// My json data track collection.
const mapAppleTrack = (item, index) => ({
  spotifyId: `itunes-${item.id || item.trackId || index}`,
  title: item.name || item.trackName || 'Unknown Track',
  artist: item.artistName || 'Unknown Artist',
  artwork: getArtworkUrl(item.artworkUrl100 || item.artworkUrl),
  releaseDate: item.releaseDate ? item.releaseDate.split('T')[0] : 'Recent'
});
// Collects new release trending songs
exports.getNewReleases = async (req, res) => {
  try {
    const response = await axios.get(TOP_SONGS_URL, { timeout: 10000 });
    const items = response.data?.feed?.results;

    if (!Array.isArray(items)) {
      throw new Error('Apple Music returned an unexpected top songs response');
    }

    res.json(items.map(mapAppleTrack));
  } catch (error) {
    console.error('Apple Music chart error:', error.message);
    res.status(502).json({ error: 'Failed to fetch trending songs from Apple Music' });
  }
};
// Handles my Discover search engine
exports.searchTracks = async (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (!query) {
    return res.status(400).json({ error: 'A search query is required' });
  }

  try {
    const response = await axios.get(ITUNES_SEARCH_URL, {
      params: { term: query, entity: 'song', media: 'music', country: 'us', limit: 25 },
      timeout: 10000
    });
    const items = response.data?.results;

    if (!Array.isArray(items)) {
      throw new Error('iTunes returned an unexpected search response');
    }

    res.json(items.map(mapAppleTrack));
  } catch (error) {
    console.error('iTunes search error:', error.message);
    res.status(502).json({ error: 'Failed to search Apple Music' });
  }
};

// Resolve Track to Playable YouTube Video ID (Remains intact to protect your daily quota limits)
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

    const ytResponse = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: 'snippet',
        q: `${artist} - ${title} official audio`,
        type: 'video',
        maxResults: 1,
        key: process.env.YOUTUBE_API_KEY
      },
      timeout: 10000
    });
    const youtubeId = ytResponse.data.items?.[0]?.id?.videoId; // Collects tracks from youtube through the api key.

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
