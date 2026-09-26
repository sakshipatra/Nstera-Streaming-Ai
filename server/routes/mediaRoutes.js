const express = require('express');
const router = express.Router();
const { Media, memoryMedia } = require('../models/Media');
const { getIsConnected } = require('../config/db');
const { initialMediaCatalog } = require('../seed/seedData');

// GET /api/media
router.get('/', async (req, res) => {
  try {
    let catalog = [];
    if (getIsConnected()) {
      catalog = await Media.find({});
      if (catalog.length === 0) catalog = initialMediaCatalog;
    } else {
      catalog = memoryMedia.length > 0 ? memoryMedia : initialMediaCatalog;
    }
    
    // Support category filter
    const category = req.query.category;
    if (category && category.toLowerCase() !== 'all') {
      catalog = catalog.filter(m => 
        m.category.toLowerCase() === category.toLowerCase() ||
        m.type.toLowerCase() === category.toLowerCase() ||
        m.tags.some(t => t.toLowerCase() === category.toLowerCase())
      );
    }

    res.json({ success: true, count: catalog.length, media: catalog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/media/featured
router.get('/featured', async (req, res) => {
  try {
    let catalog = getIsConnected() ? await Media.find({}) : memoryMedia;
    if (!catalog || catalog.length === 0) catalog = initialMediaCatalog;
    const featured = catalog.find(m => m.id === 'm1' || m.title.includes('SHADOW PROTOCOL')) || catalog[0];
    res.json({ success: true, featured });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/media/search?q=query
router.get('/search', async (req, res) => {
  try {
    const query = (req.query.q || '').trim().toLowerCase();
    let catalog = getIsConnected() ? await Media.find({}) : memoryMedia;
    if (!catalog || catalog.length === 0) catalog = initialMediaCatalog;

    if (!query) {
      return res.json({ success: true, query: '', results: catalog });
    }

    const filtered = catalog.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.tags?.some(t => t.toLowerCase().includes(query)) ||
      item.category?.toLowerCase().includes(query) ||
      item.cast?.some(c => c.toLowerCase().includes(query))
    );

    res.json({ success: true, query, results: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/media/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let item = null;

    if (getIsConnected()) {
      item = await Media.findOne({ id: id }) || await Media.findById(id).catch(() => null);
    }
    
    if (!item) {
      item = (memoryMedia.length ? memoryMedia : initialMediaCatalog).find(m => m.id === id || m._id === id);
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Media title not found' });
    }

    res.json({ success: true, media: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
