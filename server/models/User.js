const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Sakshi' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjsolIrz7twpKPSYChcXaWda1_Gne4QCYitoG8QvSm2vfuiWTuJwo0Rir137eVlwG9HLmZC-HnVP4Z_jByBWJTZ1i6HpTEcUoCJc_fu9vcTFTWZiEaITwVLd-BR71utGBw4uUZ3eWF9oLQ21tMp7Pmb2DSvOPLdm39scalFy7kET2mckXaczq5NJhJDgQB2W_nl1azs6E8fY3jeVHB_jCm_N7GfAvdFKjUMXJVDaqCNVS8QjTONp-XHw' },
  plan: { type: String, default: 'Premium 4K Ultra HD' },
  preferences: {
    audioLanguage: { type: String, default: 'English (Original)' },
    subtitleLanguage: { type: String, default: 'English [CC]' },
    autoplayNext: { type: Boolean, default: true },
    videoQuality: { type: String, default: 'Auto (Highest)' }
  },
  watchlist: [{ type: String }], // media IDs
  history: [{
    mediaId: String,
    title: String,
    watchedAt: { type: Date, default: Date.now },
    progress: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Hybrid Memory Fallback Store
const memoryUsers = [];

module.exports = { User, memoryUsers };
