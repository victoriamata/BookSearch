import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

// Retrieve the MongoDB URI from environment variables, or set a default error message if not provided
const MONGODB_URI = process.env.MONGODB_URI || 'no_database_specified - update your .env';

// Function to connect to the MongoDB database
const db = async (): Promise<typeof mongoose.connection> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected.');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
};

export default db;
