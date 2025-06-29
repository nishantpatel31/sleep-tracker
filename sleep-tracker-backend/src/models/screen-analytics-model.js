import mongoose from "mongoose";
import { AppError, BadRequestError } from "../utils/errors.js";

// Define schema for screen analytics
const screenAnalyticsSchema = new mongoose.Schema(
  {
    identity: {
      type: String,
      required: true,
    },
    screen: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    durationInSec: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Initialize model
const ScreenAnalytics = mongoose.model("ScreenAnalytics", screenAnalyticsSchema);

/**
 * Saves a screen analytics record to the database.
 * Calculates duration from start and end times.
 * 
 * @param {Object} param0 - Analytics input data
 * @param {string} param0.identity - Unique user/session identifier
 * @param {string} param0.screen - Screen or step identifier
 * @param {Date} param0.startTime - Timestamp when screen was entered
 * @param {Date} param0.endTime - Timestamp when screen was exited
 * @throws {BadRequestError | AppError} - On validation or DB error
 */
export const saveScreenAnalytics = async ({ identity, screen, startTime, endTime }) => {
  if (!identity || !screen || !startTime || !endTime) {
    throw new BadRequestError("Missing screen analytics parameters");
  }

  const duration = Math.floor((endTime - startTime) / 1000);

  if (duration < 0) {
    throw new BadRequestError("Invalid screen duration");
  }

  try {
    await ScreenAnalytics.create({
      identity,
      screen,
      startTime,
      endTime,
      durationInSec: duration,
    });
  } catch (err) {
    throw new AppError(
      "Failed to save screen analytics",
      500,
      false,
      "SCREEN_ANALYTICS_ERROR",
      {
        identity,
        screen,
        error: err.message,
      }
    );
  }
};

export default ScreenAnalytics;
