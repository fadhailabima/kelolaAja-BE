import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors";

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export class JwtUtil {
  private static getAccessTokenSecret(): string {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
    }
    return secret;
  }

  private static getRefreshTokenSecret(): string {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
    }
    return secret;
  }

  /**
   * Generate access token (short-lived)
   */
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.getAccessTokenSecret(), {
      expiresIn: "15m" // 15 minutes
    });
  }

  /**
   * Generate refresh token (long-lived)
   */
  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.getRefreshTokenSecret(), {
      expiresIn: "7d" // 7 days
    });
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokens(payload: JwtPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.getAccessTokenSecret()) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Access token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid access token");
      }
      throw new UnauthorizedError("Token verification failed");
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.getRefreshTokenSecret()) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Refresh token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid refresh token");
      }
      throw new UnauthorizedError("Token verification failed");
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decode(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
}
