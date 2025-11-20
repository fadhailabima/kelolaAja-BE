"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const prisma_1 = require("../utils/prisma");
const password_1 = require("../utils/password");
const response_1 = require("../utils/response");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const VALID_ROLES = Object.values(client_1.UserRole);
class UserController {
    static async updateProfile(req, res, next) {
        try {
            if (!req.user) {
                throw new errors_1.UnauthorizedError('User not authenticated');
            }
            const { username, fullName, email } = req.body;
            if (email && email !== req.user.email) {
                const existingUser = await prisma_1.prisma.adminUser.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    throw new errors_1.ValidationError('Email already in use');
                }
            }
            if (username) {
                const existingUser = await prisma_1.prisma.adminUser.findFirst({
                    where: {
                        username,
                        NOT: { userId: req.user.userId },
                    },
                });
                if (existingUser) {
                    throw new errors_1.ValidationError('Username already taken');
                }
            }
            const updatedUser = await prisma_1.prisma.adminUser.update({
                where: { userId: req.user.userId },
                data: {
                    username: username || undefined,
                    fullName: fullName || undefined,
                    email: email || undefined,
                },
                select: {
                    userId: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    isActive: true,
                    updatedAt: true,
                },
            });
            response_1.ResponseUtil.success(res, 'Profile updated successfully', updatedUser);
        }
        catch (error) {
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        try {
            if (!req.user) {
                throw new errors_1.UnauthorizedError('User not authenticated');
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                throw new errors_1.ValidationError('Current password and new password are required');
            }
            const user = await prisma_1.prisma.adminUser.findUnique({
                where: { userId: req.user.userId },
            });
            if (!user) {
                throw new errors_1.UnauthorizedError('User not found');
            }
            const isPasswordValid = await password_1.PasswordUtil.compare(currentPassword, user.passwordHash);
            if (!isPasswordValid) {
                throw new errors_1.ValidationError('Current password is incorrect');
            }
            const passwordValidation = password_1.PasswordUtil.validateStrength(newPassword);
            if (!passwordValidation.valid) {
                throw new errors_1.ValidationError(passwordValidation.errors.join(', '));
            }
            const newPasswordHash = await password_1.PasswordUtil.hash(newPassword);
            await prisma_1.prisma.adminUser.update({
                where: { userId: req.user.userId },
                data: { passwordHash: newPasswordHash },
            });
            response_1.ResponseUtil.success(res, 'Password changed successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async listUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const role = req.query.role;
            const isActive = req.query.isActive;
            const skip = (page - 1) * limit;
            const where = {};
            if (search) {
                where.OR = [
                    { username: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { fullName: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (role) {
                where.role = role;
            }
            if (isActive !== undefined) {
                where.isActive = isActive === 'true';
            }
            const total = await prisma_1.prisma.adminUser.count({ where });
            const users = await prisma_1.prisma.adminUser.findMany({
                where,
                select: {
                    userId: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                    createdBy: true,
                    creator: {
                        select: {
                            userId: true,
                            username: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            });
            const totalPages = Math.ceil(total / limit);
            response_1.ResponseUtil.success(res, 'Users retrieved successfully', users, 200, {
                page,
                limit,
                total,
                totalPages,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createUser(req, res, next) {
        try {
            const { username, email, password, fullName, role } = req.body;
            if (!username || !email || !password) {
                throw new errors_1.ValidationError('Username, email, and password are required');
            }
            if (role && !VALID_ROLES.includes(role)) {
                throw new errors_1.ValidationError(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new errors_1.ValidationError('Invalid email format');
            }
            const passwordValidation = password_1.PasswordUtil.validateStrength(password);
            if (!passwordValidation.valid) {
                throw new errors_1.ValidationError(passwordValidation.errors.join(', '));
            }
            const existingUser = await prisma_1.prisma.adminUser.findFirst({
                where: {
                    OR: [{ email }, { username }],
                },
            });
            if (existingUser) {
                if (existingUser.email === email) {
                    throw new errors_1.ValidationError('Email already registered');
                }
                if (existingUser.username === username) {
                    throw new errors_1.ValidationError('Username already taken');
                }
            }
            const passwordHash = await password_1.PasswordUtil.hash(password);
            const user = await prisma_1.prisma.adminUser.create({
                data: {
                    username,
                    email,
                    passwordHash,
                    fullName: fullName || null,
                    role: role || client_1.UserRole.Viewer,
                    isActive: true,
                    createdBy: req.user?.userId || null,
                },
                select: {
                    userId: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    creator: {
                        select: {
                            userId: true,
                            username: true,
                            email: true,
                        },
                    },
                },
            });
            response_1.ResponseUtil.created(res, 'User created successfully', user);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateUser(req, res, next) {
        try {
            const userId = parseInt(req.params.id);
            const { username, email, fullName, role, isActive } = req.body;
            if (role && !VALID_ROLES.includes(role)) {
                throw new errors_1.ValidationError(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
            }
            const user = await prisma_1.prisma.adminUser.findUnique({
                where: { userId },
            });
            if (!user) {
                throw new errors_1.NotFoundError('User not found');
            }
            if (req.user?.userId === userId && isActive === false) {
                throw new errors_1.ForbiddenError('You cannot deactivate your own account');
            }
            if (email && email !== user.email) {
                const existingUser = await prisma_1.prisma.adminUser.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    throw new errors_1.ValidationError('Email already in use');
                }
            }
            if (username && username !== user.username) {
                const existingUser = await prisma_1.prisma.adminUser.findFirst({
                    where: {
                        username,
                        NOT: { userId },
                    },
                });
                if (existingUser) {
                    throw new errors_1.ValidationError('Username already taken');
                }
            }
            const updatedUser = await prisma_1.prisma.adminUser.update({
                where: { userId },
                data: {
                    username: username || undefined,
                    email: email || undefined,
                    fullName: fullName !== undefined ? fullName : undefined,
                    role: role || undefined,
                    isActive: isActive !== undefined ? isActive : undefined,
                },
                select: {
                    userId: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    isActive: true,
                    updatedAt: true,
                    createdBy: true,
                    creator: {
                        select: {
                            userId: true,
                            username: true,
                            email: true,
                        },
                    },
                },
            });
            response_1.ResponseUtil.success(res, 'User updated successfully', updatedUser);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const userId = parseInt(req.params.id);
            const user = await prisma_1.prisma.adminUser.findUnique({
                where: { userId },
            });
            if (!user) {
                throw new errors_1.NotFoundError('User not found');
            }
            if (!user.isActive) {
                throw new errors_1.ValidationError('User is already deactivated');
            }
            if (req.user?.userId === userId) {
                throw new errors_1.ForbiddenError('You cannot delete your own account');
            }
            await prisma_1.prisma.adminUser.update({
                where: { userId },
                data: { isActive: false },
            });
            response_1.ResponseUtil.success(res, 'User deactivated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserById(req, res, next) {
        try {
            const userId = parseInt(req.params.id);
            const user = await prisma_1.prisma.adminUser.findUnique({
                where: { userId },
                select: {
                    userId: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                    createdBy: true,
                    creator: {
                        select: {
                            userId: true,
                            username: true,
                            email: true,
                            fullName: true,
                        },
                    },
                },
            });
            if (!user) {
                throw new errors_1.NotFoundError('User not found');
            }
            response_1.ResponseUtil.success(res, 'User retrieved successfully', user);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map