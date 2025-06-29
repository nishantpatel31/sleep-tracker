import ScreenAnalytics from "../models/screen-analytics-model.js";
import { sleepOnboarding } from "../models/sleep-onboarding-model.js";
import { AppError } from "../utils/errors.js";

/**
 * @desc Get average time (in seconds) spent on each screen
 * @route GET /api/analytics/average-screen-time
 * @access Public
 */
export const getAvgDurationPerScreen = async (req, res, next) => {
  try {
    const result = await ScreenAnalytics.aggregate([
      {
        // Group by screen and calculate average duration and count of visits
        $group: {
          _id: "$screen",
          avgDuration: { $avg: "$durationInSec" },
          totalResponses: { $sum: 1 }
        }
      },
      {
        // Rename and format the output fields
        $project: {
          _id: 0,
          screen: "$_id",
          avgDurationInSec: { $round: ["$avgDuration", 2] },
          totalResponses: 1
        }
      },
      {
        // Sort screens alphabetically (optional)
        $sort: { screen: 1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in getAvgDurationPerScreen:", error);
    next(new AppError("Failed to fetch average screen durations", 500));
  }
};

/**
 * @desc Get drop-off counts per screen based on idle time
 * @route GET /api/analytics/drop-offs?idleMinutes=5
 * @access Public
 */
export const getDropOffs = async (req, res, next) => {
  try {
    const idleMinutes = parseInt(req.query.idleMinutes);

    // Validate query param
    if (isNaN(idleMinutes) || idleMinutes < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'idleMinutes' query parameter"
      });
    }

    const result = await sleepOnboarding.aggregate([
      {
        // Only consider users who haven't completed onboarding
        $match: {
          nextScreen: { $ne: "Done" }
        }
      },
      {
        // Calculate how long ago the record was updated
        $addFields: {
          idleMinutes: {
            $divide: [
              { $subtract: [new Date(), "$updatedAt"] },
              1000 * 60 // convert ms to minutes
            ]
          }
        }
      },
      {
        // Filter users who have been idle for at least given threshold
        $match: {
          idleMinutes: { $gte: idleMinutes }
        }
      },
      {
        // Count how many users dropped off at each screen
        $group: {
          _id: "$nextScreen",
          count: { $sum: 1 }
        }
      },
      {
        // Clean up final output
        $project: {
          _id: 0,
          screen: "$_id",
          dropOffCount: "$count"
        }
      },
      {
        $sort: { dropOffCount: -1 } // Sort by most drop-offs
      }
    ]);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in getDropOffs:", error);
    next(new AppError("Failed to fetch drop-off data", 500));
  }
};
