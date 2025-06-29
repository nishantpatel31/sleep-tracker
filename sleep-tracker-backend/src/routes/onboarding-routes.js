import express from "express";
import { submitOnboardingStep } from "../controllers/onboarding-controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authorizeRole } from "../middlewares/authorize-role.js";

const router = express.Router();

/**
 * Submit a response for a specific onboarding step
 * Accessible to any authenticated user (no specific role restriction)
 * 
 * @route   POST /api/onboarding/step
 * @access  Authenticated users
 */
router.post("/step", authenticateToken, authorizeRole(), submitOnboardingStep);

export default router;
