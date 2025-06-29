/**
 * Middleware to authorize user based on allowed roles.
 * Should be used after authenticateToken middleware.
 * 
 * @param  {...string} allowedRoles - List of roles that can access the route (e.g., 'admin', 'user')
 * @returns {Function} - Express middleware function
 */
export const authorizeRole = (...allowedRoles) => {
  allowedRoles = allowedRoles || []; // fallback in case it's undefined
  return (req, res, next) => {
    // Check if user info is attached by authentication middleware
    if (!req?.role) {
      console.log(req.role);
      return res.status(401).json({
        success: false,
        error: {
          name: "Unauthorized",
          message: "Authentication required.",
        },
      });
    }

    // If no specific roles defined, allow all authenticated users
    if (allowedRoles.length === 0) return next();

    // Deny access if user's role is not in allowed roles
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        error: {
          name: "Forbidden",
          message: "Access denied. Insufficient permissions.",
        },
      });
    }

    next();
  };
};
