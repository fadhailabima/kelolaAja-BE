import { UserRole } from "@prisma/client";
export interface JwtPayload {
    userId: number;
    username: string;
    email: string;
    role: UserRole;
}
export interface LoginRequest {
    username: string;
    password: string;
}
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
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
//# sourceMappingURL=auth.d.ts.map