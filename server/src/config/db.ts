import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async (): Promise<void> => {
  // Get the string from process.env
  const dbUri = process.env.MONGO_URI;

  if (!dbUri) {
    console.error('Error: MONGO_URI is not defined in the .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    console.log('MongoDB connected securely!');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('MongoDB connection error:', error.message);
    }
    process.exit(1);
  }
};

connectDB();

