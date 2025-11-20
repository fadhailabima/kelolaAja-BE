import { UserRole } from '@prisma/client';

/**
 * JWT payload structure
 */
export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
}

/**
 * Login request body
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login response data
 */
export interface LoginResponse {
  user: {
    userId: number;
    username: string;
    email: string;
    fullName?: string;
    role: UserRole;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Refresh token request body
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Token pair
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
