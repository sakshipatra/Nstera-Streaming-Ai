const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, memoryUsers } = require('../models/User');
const { getIsConnected } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'streamflix_super_secret_jwt_key_2026_stitch';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    let user = null;

    if (getIsConnected()) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      // Auto-create account for seamless delight demo login if email doesn't exist
      user = {
        id: 'u_' + Date.now(),
        name: email.split('@')[0] || 'Sakshi',
        email: email.toLowerCase(),
        password: password,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjsolIrz7twpKPSYChcXaWda1_Gne4QCYitoG8QvSm2vfuiWTuJwo0Rir137eVlwG9HLmZC-HnVP4Z_jByBWJTZ1i6HpTEcUoCJc_fu9vcTFTWZiEaITwVLd-BR71utGBw4uUZ3eWF9oLQ21tMp7Pmb2DSvOPLdm39scalFy7kET2mckXaczq5NJhJDgQB2W_nl1azs6E8fY3jeVHB_jCm_N7GfAvdFKjUMXJVDaqCNVS8QjTONp-XHw',
        plan: 'Premium 4K Ultra HD',
        preferences: {
          audioLanguage: 'English (Original)',
          subtitleLanguage: 'English [CC]',
          autoplayNext: true,
          videoQuality: 'Auto (Highest)'
        },
        watchlist: ['m1', 's1', 'm2']
      };

      if (getIsConnected()) {
        const newUser = new User(user);
        await newUser.save();
        user = newUser;
      } else {
        memoryUsers.push(user);
      }
    }

    const token = jwt.sign(
      { userId: user._id || user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        preferences: user.preferences,
        watchlist: user.watchlist || ['m1', 's1', 'm2']
      },
      message: 'Successfully logged in!'
    });
  } catch (error) {
    console.error('[Auth Login Error]', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const newUserObj = {
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: password,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjsolIrz7twpKPSYChcXaWda1_Gne4QCYitoG8QvSm2vfuiWTuJwo0Rir137eVlwG9HLmZC-HnVP4Z_jByBWJTZ1i6HpTEcUoCJc_fu9vcTFTWZiEaITwVLd-BR71utGBw4uUZ3eWF9oLQ21tMp7Pmb2DSvOPLdm39scalFy7kET2mckXaczq5NJhJDgQB2W_nl1azs6E8fY3jeVHB_jCm_N7GfAvdFKjUMXJVDaqCNVS8QjTONp-XHw',
      plan: 'Premium 4K Ultra HD',
      watchlist: ['m1', 's1']
    };

    let user = null;
    if (getIsConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
      user = new User(newUserObj);
      await user.save();
    } else {
      user = { id: 'u_' + Date.now(), ...newUserObj };
      memoryUsers.push(user);
    }

    const token = jwt.sign(
      { userId: user._id || user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        watchlist: user.watchlist
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({
    success: true,
    user: {
      name: 'Sakshi',
      email: 'sakshi@streamflix.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjsolIrz7twpKPSYChcXaWda1_Gne4QCYitoG8QvSm2vfuiWTuJwo0Rir137eVlwG9HLmZC-HnVP4Z_jByBWJTZ1i6HpTEcUoCJc_fu9vcTFTWZiEaITwVLd-BR71utGBw4uUZ3eWF9oLQ21tMp7Pmb2DSvOPLdm39scalFy7kET2mckXaczq5NJhJDgQB2W_nl1azs6E8fY3jeVHB_jCm_N7GfAvdFKjUMXJVDaqCNVS8QjTONp-XHw',
      plan: 'Premium 4K Ultra HD'
    }
  });
});

module.exports = router;
