export interface JwtPayload {
    userId: number;
    email: string;
    role: string;
}
export declare class JwtUtil {
    private static getAccessTokenSecret;
    private static getRefreshTokenSecret;
    static generateAccessToken(payload: JwtPayload): string;
    static generateRefreshToken(payload: JwtPayload): string;
    static generateTokens(payload: JwtPayload): {
        accessToken: string;
        refreshToken: string;
    };
    static verifyAccessToken(token: string): JwtPayload;
    static verifyRefreshToken(token: string): JwtPayload;
    static decode(token: string): JwtPayload | null;
}
//# sourceMappingURL=jwt.d.ts.map