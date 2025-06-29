import jwt from 'jsonwebtoken';

import {
  userSignup,
  nicknamePresent,
  checkNickNameAndPassword
} from "../models/auth-model.js";

import { updateIdentityValueWithNickName } from "../models/sleep-onboarding-model.js";
import { JWT_SECRET, JWT_EXPIRY } from "../config/jwt-config.js";
import logger from "../utils/logger.js";

/**
 * @desc Handles user signup.
 * @route POST /api/auth/signup
 * @access Public
 */
export const signupAuth = async (req, res, next) => {
  try {
    const { nickname, password, identity } = req.body;

    // Validation check
    if (!nickname || !password) {
      logger.warn("Signup failed: Missing nickname or password");
      return res.status(400).json({
        success: false,
        message: "Nickname and password are required."
      });
    }

    // Check for nickname uniqueness (throws if already exists)
    await nicknamePresent(nickname);

    // Register new user
    await userSignup({ nickname, password });

    // Optional: Link onboarding identity (if any)
    if (identity) {
      await updateIdentityValueWithNickName({ identity, nickname });
      logger.info(`Onboarding identity '${identity}' linked to nickname '${nickname}'.`);
    }

    logger.info(`User successfully registered: ${nickname}`);

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      identity: identity ? nickname : ""
    });

  } catch (err) {
    logger.error("Signup error:", err);
    next(err);
  }
};

/**
 * @desc Handles user login.
 *        - Validates credentials
 *        - Generates and returns JWT token with role
 * @route POST /api/auth/signin
 * @access Public
 */
export const signinAuth = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;

    // Basic field validation
    if (!nickname || !password) {
      logger.warn("Signin failed: Missing nickname or password");
      return res.status(400).json({
        success: false,
        message: "Nickname and password are required."
      });
    }

    // Validate user credentials
    await checkNickNameAndPassword({ nickname, password });

    // Assign role based on naming convention
    const isAdmin = nickname.endsWith("@sleeptracker.com");
    const role = isAdmin ? "admin" : "user";

    // JWT Payload
    const payload = { nickname, role };

    // Sign token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    logger.info(`User logged in: ${nickname} as ${role}`);

    return res.status(200).json({
      success: true,
      message: "User login successful.",
      token,
      nickname
    });

  } catch (err) {
    logger.error(`Signin error for user '${req.body?.nickname || "unknown"}':`, err);
    next(err);
  }
};
