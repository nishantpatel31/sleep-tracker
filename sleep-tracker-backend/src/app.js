import express from "express";
import cors from "cors";
import onboardingRoutes from "./routes/onboarding-routes.js";
import authRoutes from "./routes/auth-routes.js";
import analyticsRoutes from "./routes/analytics-routes.js";
import connectDB from "./config/db-config.js";
import logger from "./utils/logger.js"
import { CustomError } from "./utils/custom-error.js";

import path from 'path';
import { fileURLToPath } from 'url';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ----------- Middleware ------------

// Parses incoming JSON requests
app.use(express.json());

// Enable Cross-Origin Resource Sharing (tighten origin for prod)
app.use(cors());

// ---------- Database Connection ------------
try {
  await connectDB();
} catch (err) {
  console.error("❌ Failed to connect to DB:", err);
  process.exit(1); // Exit hard if DB is not connected
}

// ----------- API Routes ------------
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);

// ----------- Static Frontend Serving ------------
const frontendPath = path.resolve(__dirname, "../../sleep-tracker-frontend");
app.use(express.static(frontendPath));

// ----------- Centralized Error Handling ------------
app.use((err, req, res, next) => {
  logger.error(`❌ Error: [${err.name}] ${err.message}`);

  const isDev = process.env.NODE_ENV !== "production";

  // CustomError: properly format the response
  if (err instanceof CustomError) {
    return res.status(err.code).json(err.toResponse(isDev, isDev));
  }

  // Unknown error fallback
  return res.status(500).json({
    success: false,
    code: 500,
    error: {
      name: err.name || "InternalServerError",
      message: isDev ? err.message : "Something went wrong.",
      stack: isDev ? err.stack : undefined
    }
  });
});

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
