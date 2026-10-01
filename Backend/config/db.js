import mongoose from 'mongoose';

let cachedConnPromise = null;

export const connectDB = async () => {
  if (cachedConnPromise) {
    return cachedConnPromise;
  }
  
  try {
    cachedConnPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    }).then(conn => {
      console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
      return conn;
    });
    
    return await cachedConnPromise;
  } catch (error) {
    cachedConnPromise = null; // Reset on failure
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(`Tip: Ensure your MONGO_URI in Backend/.env has your Atlas username, password, and whitelist IP (0.0.0.0/0 allowed).`);
  }
};
