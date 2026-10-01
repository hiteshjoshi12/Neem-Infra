import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(`Tip: Ensure your MONGO_URI in Backend/.env has your Atlas username, password, and whitelist IP (0.0.0.0/0 allowed).`);
    // Do not terminate process immediately so server can still serve health check / informative errors
  }
};
