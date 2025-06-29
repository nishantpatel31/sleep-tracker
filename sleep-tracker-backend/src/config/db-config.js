import mongoose from "mongoose";
import logger from "../utils/logger.js";

// Establish a MongoDB connection using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connection established successfully.");
  } catch (err) {
    logger.error("Database connection failed:", err);
    process.exit(1); // Force stop the process if DB can't connect
  }
};

export default connectDB;
