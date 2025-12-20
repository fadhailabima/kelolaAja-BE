import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { PasswordUtil } from "../utils/password";
import { JwtUtil } from "../utils/jwt";
import { ResponseUtil } from "../utils/response";
import { ValidationError, UnauthorizedError } from "../utils/errors";

export class AuthController {
  /**
   * POST /api/auth/login
   * Login user and generate tokens
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        throw new ValidationError("Email and password are required");
      }

      // Find user
      const user = await prisma.adminUser.findUnique({
        where: { email }
      });

      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedError("Account is deactivated");
      }

      // Verify password
      const isPasswordValid = await PasswordUtil.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
      }

      // Update last login
      await prisma.adminUser.update({
        where: { userId: user.userId },
        data: { lastLogin: new Date() }
      });

      // Generate tokens
      const tokens = JwtUtil.generateTokens({
        userId: user.userId,
        email: user.email,
        role: user.role || "Viewer"
      });

      // Set cookies
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
        path: '/'
      };

      res.cookie('access_token', tokens.accessToken, cookieOptions);
      if (tokens.refreshToken) {
        res.cookie('refresh_token', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
      }
      res.cookie('token', tokens.accessToken, cookieOptions); // Legacy/Fallback support

      // Return user data and tokens
      return ResponseUtil.success(res, "Login successful", {
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        },
        ...tokens
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ValidationError("Refresh token is required");
      }

      // Verify refresh token
      const decoded = JwtUtil.verifyRefreshToken(refreshToken);

      // Verify user still exists and is active
      const user = await prisma.adminUser.findUnique({
        where: { userId: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedError("User not found or inactive");
      }

      // Generate new access token
      const accessToken = JwtUtil.generateAccessToken({
        userId: user.userId,
        email: user.email,
        role: user.role || "Viewer"
      });

      return ResponseUtil.success(res, "Token refreshed successfully", {
        accessToken
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user (client should remove tokens)
   */
  static async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a stateless JWT system, logout is handled client-side
      // If you want to implement token blacklisting, you can do it here

      return ResponseUtil.success(res, "Logout successful");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User not authenticated");
      }

      const user = await prisma.adminUser.findUnique({
        where: { userId: req.user.userId },
        select: {
          userId: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      return ResponseUtil.success(res, "Profile retrieved successfully", user);
    } catch (error) {
      next(error);
    }
  }
}
