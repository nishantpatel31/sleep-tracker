import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { DuplicateKeyError } from "../utils/errors.js";
import { CustomError } from "../utils/custom-error.js";

// Define the User schema
const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Initialize the Mongoose model
const User = mongoose.model("User", userSchema);

/**
 * Checks if a nickname is already present in the database.
 * @param {string} nickname - The nickname to check.
 * @throws {DuplicateKeyError} - If the nickname already exists.
 */
export const nicknamePresent = async (nickname) => {
  const existingUser = await User.findOne({ nickname });

  if (existingUser) {
    throw new DuplicateKeyError(
      "Nickname already exists.",
      { nickname }
    );
  }
};

/**
 * Creates a new user with hashed password.
 * @param {Object} param0 - Object containing nickname and password.
 * @throws {DuplicateKeyError | CustomError} - If a DB conflict or internal error occurs.
 */
export const userSignup = async ({ nickname, password }) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nickname, password: hashPassword });
    await newUser.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new DuplicateKeyError(
        "Nickname already exists.",
        { nickname }
      );
    }

    throw new CustomError(
      "Failed to create user. Please try again later.",
      500,
      false,
      "USER_CREATION_FAILED",
      {
        nickname,
        mongoError: err.message
      }
    );
  }
};

/**
 * Validates nickname and password credentials.
 * @param {Object} param0 - Object containing nickname and password.
 * @returns {boolean} - Returns true if valid.
 * @throws {CustomError} - If credentials are invalid.
 */
export const checkNickNameAndPassword = async ({ nickname, password }) => {
  const existingUser = await User.findOne({ nickname });

  if (!existingUser) {
    throw new CustomError(
      "Invalid username or password. Please try again.",
      401,
      true,
      "INVALID_CREDENTIALS",
      { nickname }
    );
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    throw new CustomError(
      "Invalid username or password. Please try again.",
      401,
      true,
      "INVALID_CREDENTIALS",
      { nickname }
    );
  }

  return true;
};
