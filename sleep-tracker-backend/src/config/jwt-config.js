/**
 * JWT secret and expiration config.
 * In production, always ensure JWT_SECRET is defined.
 */
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRY = process.env.JWT_EXPIRY || "2h";

// Fail fast if missing secret in production
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("Missing JWT_SECRET in production environment");
}
