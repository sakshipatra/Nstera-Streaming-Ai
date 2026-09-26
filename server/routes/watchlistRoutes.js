const express = require('express');
const router = express.Router();
const { Media, memoryMedia } = require('../models/Media');
const { initialMediaCatalog } = require('../seed/seedData');

// In-memory user watchlist state for fast active session
let activeWatchlistIds = ['m1', 's1', 'm2'];

// GET /api/watchlist
router.get('/', async (req, res) => {
  try {
    const catalog = memoryMedia.length > 0 ? memoryMedia : initialMediaCatalog;
    const items = catalog.filter(m => activeWatchlistIds.includes(m.id));
    res.json({ success: true, count: items.length, watchlist: items, ids: activeWatchlistIds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/watchlist/toggle
router.post('/toggle', async (req, res) => {
  try {
    const { mediaId } = req.body;
    if (!mediaId) return res.status(400).json({ success: false, message: 'mediaId required' });

    let added = false;
    if (activeWatchlistIds.includes(mediaId)) {
      activeWatchlistIds = activeWatchlistIds.filter(id => id !== mediaId);
      added = false;
    } else {
      activeWatchlistIds.push(mediaId);
      added = true;
    }

    res.json({
      success: true,
      added,
      watchlistIds: activeWatchlistIds,
      message: added ? 'Added to My List' : 'Removed from My List'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
