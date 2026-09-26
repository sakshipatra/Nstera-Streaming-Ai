const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  id: String,
  number: Number,
  title: String,
  duration: String,
  synopsis: String,
  thumbnail: String,
  progress: Number
});

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['movie', 'series'], default: 'movie' },
  year: { type: Number, default: 2026 },
  rating: { type: String, default: 'TV-MA' },
  duration: { type: String, default: '2h 14m' },
  matchScore: { type: String, default: '98% Match' },
  badge: { type: String, default: 'TOP 10' },
  tags: [{ type: String }],
  description: { type: String },
  bannerUrl: { type: String },
  posterUrl: { type: String },
  videoUrl: { type: String },
  cast: [{ type: String }],
  director: { type: String },
  seasonsCount: { type: Number, default: 1 },
  episodes: [episodeSchema],
  category: { type: String, default: 'Action' },
  isOriginal: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: true }
});

const Media = mongoose.model('Media', mediaSchema);

const memoryMedia = [];

module.exports = { Media, memoryMedia };
