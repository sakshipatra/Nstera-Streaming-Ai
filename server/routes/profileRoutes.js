const express = require('express');
const router = express.Router();

let currentProfile = {
  id: 'u_1001',
  name: 'Sakshi',
  email: 'sakshi@streamflix.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjsolIrz7twpKPSYChcXaWda1_Gne4QCYitoG8QvSm2vfuiWTuJwo0Rir137eVlwG9HLmZC-HnVP4Z_jByBWJTZ1i6HpTEcUoCJc_fu9vcTFTWZiEaITwVLd-BR71utGBw4uUZ3eWF9oLQ21tMp7Pmb2DSvOPLdm39scalFy7kET2mckXaczq5NJhJDgQB2W_nl1azs6E8fY3jeVHB_jCm_N7GfAvdFKjUMXJVDaqCNVS8QjTONp-XHw',
  plan: 'Premium 4K Ultra HD',
  audioLanguage: 'English (Original)',
  subtitleLanguage: 'English [CC]',
  autoplayNext: true,
  videoQuality: 'Auto (Highest)',
  history: [
    { id: 'm1', title: 'SHADOW PROTOCOL', watchedAt: 'Today', progress: 85 },
    { id: 's1', title: 'STRANGER DIMENSIONS: S1 E2', watchedAt: 'Yesterday', progress: 30 },
    { id: 'm2', title: 'REDLINE VELOCITY', watchedAt: '3 days ago', progress: 100 }
  ]
};

// GET /api/profile
router.get('/', (req, res) => {
  res.json({ success: true, profile: currentProfile });
});

// PUT /api/profile
router.put('/', (req, res) => {
  try {
    const { name, email, avatar, audioLanguage, subtitleLanguage, autoplayNext, videoQuality } = req.body;
    
    if (name) currentProfile.name = name;
    if (email) currentProfile.email = email;
    if (avatar) currentProfile.avatar = avatar;
    if (audioLanguage) currentProfile.audioLanguage = audioLanguage;
    if (subtitleLanguage) currentProfile.subtitleLanguage = subtitleLanguage;
    if (typeof autoplayNext === 'boolean') currentProfile.autoplayNext = autoplayNext;
    if (videoQuality) currentProfile.videoQuality = videoQuality;

    res.json({
      success: true,
      message: 'Profile preferences updated successfully!',
      profile: currentProfile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/profile/history
router.delete('/history', (req, res) => {
  currentProfile.history = [];
  res.json({ success: true, message: 'Watch history cleared', profile: currentProfile });
});

module.exports = router;
