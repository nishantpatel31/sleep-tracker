import mongoose from "mongoose";
import {
  BadRequestError,
  DuplicateKeyError,
  AppError
} from "../utils/errors.js";

// Schema for storing sleep onboarding steps
const sleepOnboardingSchema = new mongoose.Schema(
  {
    // Unique identity (either a sessionId or userId)
    identity: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    // Stores user responses by step key
    responses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Next screen identifier (used by frontend)
    nextScreen: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Initialize model
const sleepOnboarding = mongoose.model("sleepOnboarding", sleepOnboardingSchema);

/**
 * Save user response to onboarding step
 * If record exists, it will be updated; otherwise, a new record will be inserted
 * 
 * @param {string} identity - userId or sessionId
 * @param {object} updateData - fields to update (responses, nextScreen, etc)
 * @returns {object} - The updated onboarding document
 * @throws {BadRequestError | DuplicateKeyError | AppError}
 */
export const saveOnboardingStep = async (identity, updateData) => {
  try {
    const result = await sleepOnboarding.findOneAndUpdate(
      { identity },
      {
        $set: updateData,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, new: true }
    );

    if (!result) {
      throw new BadRequestError("Failed to update onboarding step.", {
        identity,
      });
    }

    return result;
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new BadRequestError(err.message, {
        identity,
        validationFields: Object.keys(err.errors),
      });
    } else if (err.code === 11000) {
      throw new DuplicateKeyError("Identity already exists.", {
        identity,
      });
    } else {
      throw new AppError(
        "Unexpected error while saving onboarding step.",
        500,
        false,
        "ONBOARDING_SAVE_FAILED",
        {
          identity,
          originalError: err.message,
        }
      );
    }
  }
};

/**
 * Replaces temporary identity (session) with permanent one (nickname) after signup
 * 
 * @param {object} param0 - Object containing { identity, nickname }
 * @returns {object|null} - Updated onboarding document or null if not found
 */
export const updateIdentityValueWithNickName = async ({ identity, nickname }) => {
  return await sleepOnboarding.findOneAndUpdate(
    { identity },
    { $set: { identity: nickname } },
    { new: true }
  );
};

export { sleepOnboarding };
export default saveOnboardingStep;
