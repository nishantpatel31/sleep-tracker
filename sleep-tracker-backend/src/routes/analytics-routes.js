import express from "express";
import {
  getAvgDurationPerScreen,
  getDropOffs
} from "../controllers/analytics-controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authorizeRole } from "../middlewares/authorize-role.js";

const router = express.Router();

// Route to get average duration spent on each screen (admin only)
router.get(
  "/average-screen-time",
  authenticateToken,
  authorizeRole("admin"),
  getAvgDurationPerScreen
);

// Route to get screen drop-off analytics (admin only)
router.get(
  "/screen-drop-off",
  authenticateToken,
  authorizeRole("admin"),
  getDropOffs
);

export default router;
