"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("./errors");
class JwtUtil {
    static getAccessTokenSecret() {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
        }
        return secret;
    }
    static getRefreshTokenSecret() {
        const secret = process.env.REFRESH_TOKEN_SECRET;
        if (!secret) {
            throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
        }
        return secret;
    }
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.getAccessTokenSecret(), {
            expiresIn: "15m"
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.getRefreshTokenSecret(), {
            expiresIn: "7d"
        });
    }
    static generateTokens(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        };
    }
    static verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.getAccessTokenSecret());
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_1.UnauthorizedError("Access token has expired");
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.UnauthorizedError("Invalid access token");
            }
            throw new errors_1.UnauthorizedError("Token verification failed");
        }
    }
    static verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.getRefreshTokenSecret());
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_1.UnauthorizedError("Refresh token has expired");
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.UnauthorizedError("Invalid refresh token");
            }
            throw new errors_1.UnauthorizedError("Token verification failed");
        }
    }
    static decode(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch {
            return null;
        }
    }
}
exports.JwtUtil = JwtUtil;
//# sourceMappingURL=jwt.js.map