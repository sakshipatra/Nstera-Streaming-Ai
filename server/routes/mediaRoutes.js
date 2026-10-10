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

// POST /api/media (Create Media)
router.post('/', async (req, res) => {
  try {
    const {
      title, type, year, rating, duration, matchScore, badge,
      tags, description, bannerUrl, posterUrl, videoUrl, cast,
      director, seasonsCount, episodes, category, isOriginal, isTrending
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const newId = 'm_' + Date.now();
    const mediaData = {
      id: newId,
      title: title.trim(),
      type: type || 'movie',
      year: parseInt(year) || new Date().getFullYear(),
      rating: rating || 'TV-MA',
      duration: duration || '2h 00m',
      matchScore: matchScore || '98% Match',
      badge: badge || 'NEW',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : ['Action']),
      description: description || '',
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
      posterUrl: posterUrl || bannerUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(',').map(c => c.trim()).filter(Boolean) : []),
      director: director || '',
      seasonsCount: parseInt(seasonsCount) || 1,
      episodes: episodes || [],
      category: category || 'Action',
      isOriginal: Boolean(isOriginal),
      isTrending: Boolean(isTrending)
    };

    let created = null;

    if (getIsConnected()) {
      created = await Media.create(mediaData);
    } else {
      created = { ...mediaData, _id: newId };
      memoryMedia.unshift(created);
    }

    res.status(201).json({ success: true, message: 'Media title created successfully', media: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/media/:id (Update Media)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatePayload = { ...req.body };

    // Format tags/cast if string
    if (typeof updatePayload.tags === 'string') {
      updatePayload.tags = updatePayload.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (typeof updatePayload.cast === 'string') {
      updatePayload.cast = updatePayload.cast.split(',').map(c => c.trim()).filter(Boolean);
    }

    let updated = null;

    if (getIsConnected()) {
      updated = await Media.findOneAndUpdate(
        { $or: [{ id: id }, { _id: id }] },
        { $set: updatePayload },
        { new: true }
      );
    }

    // Always update in-memory catalog
    const memIndex = memoryMedia.findIndex(m => m.id === id || m._id === id);
    if (memIndex !== -1) {
      memoryMedia[memIndex] = { ...memoryMedia[memIndex], ...updatePayload };
      if (!updated) updated = memoryMedia[memIndex];
    } else if (!updated && !getIsConnected()) {
      // Find in initialMediaCatalog fallback
      const initItem = initialMediaCatalog.find(m => m.id === id || m._id === id);
      if (initItem) {
        const newItem = { ...initItem, ...updatePayload };
        memoryMedia.push(newItem);
        updated = newItem;
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Media title not found for update' });
    }

    res.json({ success: true, message: 'Media title updated successfully', media: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/media/:id (Delete Media)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (getIsConnected()) {
      const resMongo = await Media.findOneAndDelete({ $or: [{ id: id }, { _id: id }] });
      if (resMongo) deleted = true;
    }

    const memIndex = memoryMedia.findIndex(m => m.id === id || m._id === id);
    if (memIndex !== -1) {
      memoryMedia.splice(memIndex, 1);
      deleted = true;
    }

    res.json({ success: true, message: deleted ? 'Media title deleted' : 'Media removed from local catalog' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

