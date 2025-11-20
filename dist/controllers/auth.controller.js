"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = require("../utils/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const errors_1 = require("../utils/errors");
class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new errors_1.ValidationError("Email and password are required");
            }
            const user = await prisma_1.prisma.adminUser.findUnique({
                where: { email }
            });
            if (!user) {
                throw new errors_1.UnauthorizedError("Invalid email or password");
            }
            if (!user.isActive) {
                throw new errors_1.UnauthorizedError("Account is deactivated");
            }
            const isPasswordValid = await password_1.PasswordUtil.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                throw new errors_1.UnauthorizedError("Invalid email or password");
            }
            await prisma_1.prisma.adminUser.update({
                where: { userId: user.userId },
                data: { lastLogin: new Date() }
            });
            const tokens = jwt_1.JwtUtil.generateTokens({
                userId: user.userId,
                email: user.email,
                role: user.role || "Viewer"
            });
            return response_1.ResponseUtil.success(res, "Login successful", {
                user: {
                    userId: user.userId,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role
                },
                ...tokens
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new errors_1.ValidationError("Refresh token is required");
            }
            const decoded = jwt_1.JwtUtil.verifyRefreshToken(refreshToken);
            const user = await prisma_1.prisma.adminUser.findUnique({
                where: { userId: decoded.userId }
            });
            if (!user || !user.isActive) {
                throw new errors_1.UnauthorizedError("User not found or inactive");
            }
            const accessToken = jwt_1.JwtUtil.generateAccessToken({
                userId: user.userId,
                email: user.email,
                role: user.role || "Viewer"
            });
            return response_1.ResponseUtil.success(res, "Token refreshed successfully", {
                accessToken
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(_req, res, next) {
        try {
            return response_1.ResponseUtil.success(res, "Logout successful");
        }
        catch (error) {
            next(error);
        }
    }
    static async getProfile(req, res, next) {
        try {
            if (!req.user) {
                throw new errors_1.UnauthorizedError("User not authenticated");
            }
            const user = await prisma_1.prisma.adminUser.findUnique({
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
                throw new errors_1.UnauthorizedError("User not found");
            }
            return response_1.ResponseUtil.success(res, "Profile retrieved successfully", user);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map