import { Request, Response, NextFunction } from "express";
import { JwtUtil, JwtPayload } from "../utils/jwt";
import { ResponseUtil } from "../utils/response";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT token
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (req.cookies && (req.cookies.token || req.cookies.access_token)) {
      // Check cookies
      token = req.cookies.token || req.cookies.access_token;
    }

    if (!token) {
      ResponseUtil.unauthorized(res, "No token provided");
      return;
    }

    // Verify token
    const decoded = JwtUtil.verifyAccessToken(token);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid token";
    ResponseUtil.unauthorized(res, message);
  }
};

/**
 * Middleware to check if user has required role(s)
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtil.unauthorized(res, "User not authenticated");
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ResponseUtil.forbidden(res, "You do not have permission to access this resource");
      return;
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = JwtUtil.verifyAccessToken(token);
      req.user = decoded;
    }

    next();
  } catch {
    // Silently fail for optional auth
    next();
  }
};
