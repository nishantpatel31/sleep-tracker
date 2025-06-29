import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { CustomError } from "../utils/custom-error.js";

/**
 * Middleware to optionally authenticate user using JWT.
 * If token is valid, attaches decoded payload to req.user.
 * If invalid token is present, rejects request.
 * If no token, continues without attaching req.user.
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.nickname;
      req.role = decoded.role;
    } catch (err) {
      return next(
        new CustomError(
          "Access token is invalid or expired.",
          403,
          true,
          "INVALID_TOKEN",
          { tokenFragment: token.slice(0, 10) + "..." }
        )
      );
    }
  }

  next();
};
