const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('./config/db');
const { seedCatalog } = require('./seed/seedData');

const authRoutes = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/profile', profileRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    app: 'StreamFlix Node.js Express Backend Service'
  });
});

// Serve frontend in production if built
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedCatalog();

  app.listen(PORT, () => {
    console.log(`[StreamFlix Backend] Running on http://localhost:${PORT}`);
  });
};

startServer();
