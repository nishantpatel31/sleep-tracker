import express from "express";
import { signupAuth, signinAuth } from "../controllers/auth-controller.js";

const router = express.Router();

/**
 * Register a new user with nickname and password
 * @route   POST /api/onboarding/signup
 * @access  Public
 */
router.post("/signup", signupAuth);

/**
 * Authenticate user and return JWT token
 * @route   POST /api/onboarding/signin
 * @access  Public
 */
router.post("/signin", signinAuth);

export default router;
