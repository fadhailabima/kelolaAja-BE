import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { PasswordUtil } from '../utils/password';
import { ResponseUtil } from '../utils/response';
import { ValidationError, UnauthorizedError, NotFoundError, ForbiddenError } from '../utils/errors';
import { UserRole } from '@prisma/client';

// Valid roles based on schema
const VALID_ROLES = Object.values(UserRole);

export class UserController {
  /**
   * PUT /api/users/me
   * Update current user profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const { username, fullName, email } = req.body;

      // Check if email is being changed and already exists
      if (email && email !== req.user.email) {
        const existingUser = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new ValidationError('Email already in use');
        }
      }

      // Check if username is being changed and already exists
      if (username) {
        const existingUser = await prisma.adminUser.findFirst({
          where: {
            username,
            NOT: { userId: req.user.userId },
          },
        });

        if (existingUser) {
          throw new ValidationError('Username already taken');
        }
      }

      // Update user
      const updatedUser = await prisma.adminUser.update({
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

      ResponseUtil.success(res, 'Profile updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/me/password
   * Change current user password
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new ValidationError('Current password and new password are required');
      }

      // Get current user with password hash
      const user = await prisma.adminUser.findUnique({
        where: { userId: req.user.userId },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Verify current password
      const isPasswordValid = await PasswordUtil.compare(currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        throw new ValidationError('Current password is incorrect');
      }

      // Validate new password strength
      const passwordValidation = PasswordUtil.validateStrength(newPassword);
      if (!passwordValidation.valid) {
        throw new ValidationError(passwordValidation.errors.join(', '));
      }

      // Hash new password
      const newPasswordHash = await PasswordUtil.hash(newPassword);

      // Update password
      await prisma.adminUser.update({
        where: { userId: req.user.userId },
        data: { passwordHash: newPasswordHash },
      });

      ResponseUtil.success(res, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users
   * List all users (Admin only) with pagination
   */
  static async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const role = req.query.role as string;
      const isActive = req.query.isActive as string;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

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

      // Get total count
      const total = await prisma.adminUser.count({ where });

      // Get users
      const users = await prisma.adminUser.findMany({
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

      ResponseUtil.success(
        res,
        'Users retrieved successfully',
        users,
        200,
        {
          page,
          limit,
          total,
          totalPages,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users
   * Create new user (Admin only)
   */
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password, fullName, role } = req.body;

      // Validation
      if (!username || !email || !password) {
        throw new ValidationError('Username, email, and password are required');
      }

      // Validate role
      if (role && !VALID_ROLES.includes(role)) {
        throw new ValidationError(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
      }

      // Validate password strength
      const passwordValidation = PasswordUtil.validateStrength(password);
      if (!passwordValidation.valid) {
        throw new ValidationError(passwordValidation.errors.join(', '));
      }

      // Check if user already exists
      const existingUser = await prisma.adminUser.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new ValidationError('Email already registered');
        }
        if (existingUser.username === username) {
          throw new ValidationError('Username already taken');
        }
      }

      // Hash password
      const passwordHash = await PasswordUtil.hash(password);

      // Create user
      const user = await prisma.adminUser.create({
        data: {
          username,
          email,
          passwordHash,
          fullName: fullName || null,
          role: role || UserRole.Viewer,
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

      ResponseUtil.created(res, 'User created successfully', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id
   * Update user by ID (Admin only)
   */
  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { username, email, fullName, role, isActive } = req.body;

      // Validate role if provided
      if (role && !VALID_ROLES.includes(role)) {
        throw new ValidationError(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
      }

      // Check if user exists
      const user = await prisma.adminUser.findUnique({
        where: { userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Prevent self-deactivation
      if (req.user?.userId === userId && isActive === false) {
        throw new ForbiddenError('You cannot deactivate your own account');
      }

      // Check if email is being changed and already exists
      if (email && email !== user.email) {
        const existingUser = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new ValidationError('Email already in use');
        }
      }

      // Check if username is being changed and already exists
      if (username && username !== user.username) {
        const existingUser = await prisma.adminUser.findFirst({
          where: {
            username,
            NOT: { userId },
          },
        });

        if (existingUser) {
          throw new ValidationError('Username already taken');
        }
      }

      // Update user
      const updatedUser = await prisma.adminUser.update({
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

      ResponseUtil.success(res, 'User updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id
   * Deactivate user by ID (Admin only)
   * Note: AdminUser table doesn't have deletedAt field, so we just deactivate
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);

      // Check if user exists
      const user = await prisma.adminUser.findUnique({
        where: { userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if already deactivated
      if (!user.isActive) {
        throw new ValidationError('User is already deactivated');
      }

      // Prevent self-deletion
      if (req.user?.userId === userId) {
        throw new ForbiddenError('You cannot delete your own account');
      }

      // Deactivate user (soft delete)
      await prisma.adminUser.update({
        where: { userId },
        data: { isActive: false },
      });

      ResponseUtil.success(res, 'User deactivated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id
   * Get user by ID (Admin only)
   */
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);

      const user = await prisma.adminUser.findUnique({
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
        throw new NotFoundError('User not found');
      }

      ResponseUtil.success(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}
