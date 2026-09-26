const mongoose = require('mongoose');

let isConnectedToMongo = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/streamflix';
    mongoose.set('strictQuery', true);
    
    // Set a 3 second timeout so if MongoDB isn't running local daemon, it falls back seamlessly
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    
    isConnectedToMongo = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB instance (${error.message}). Running with robust hybrid storage fallback.`);
    isConnectedToMongo = false;
    return false;
  }
};

const getIsConnected = () => isConnectedToMongo;

module.exports = { connectDB, getIsConnected };
