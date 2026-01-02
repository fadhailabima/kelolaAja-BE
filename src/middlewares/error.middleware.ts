import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { ResponseUtil } from "../utils/response";

/**
 * Global error handler middleware
 */
export const errorHandler = (err: Error | AppError, req: Request, res: Response, _next: NextFunction): void => {
  // Log error
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.url,
    method: req.method
  });

  // Handle operational errors
  if (err instanceof AppError && err.isOperational) {
    ResponseUtil.error(res, err.message, null, err.statusCode);
    return;
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;

    if (prismaError.code === "P2002") {
      ResponseUtil.error(res, "A record with this value already exists", null, 409);
      return;
    }

    if (prismaError.code === "P2025") {
      ResponseUtil.notFound(res, "Record not found");
      return;
    }
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    ResponseUtil.error(res, err.message, null, 400);
    return;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    ResponseUtil.unauthorized(res, "Invalid or expired token");
    return;
  }

  // Default to 500 server error
  ResponseUtil.serverError(
    res,
    process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    process.env.NODE_ENV === "development" ? err.stack : undefined
  );
};
