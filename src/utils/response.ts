import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ResponseUtil {
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200, meta?: ApiResponse["meta"]): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };

    if (meta) {
      response.meta = meta;
    }

    res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, errors?: any, statusCode: number = 400): void {
    const response: ApiResponse = {
      success: false,
      message,
      errors
    };

    res.status(statusCode).json(response);
  }

  static created<T>(res: Response, message: string, data?: T): void {
    this.success(res, message, data, 201);
  }

  static unauthorized(res: Response, message: string = "Unauthorized"): void {
    this.error(res, message, null, 401);
  }

  static forbidden(res: Response, message: string = "Forbidden"): void {
    this.error(res, message, null, 403);
  }

  static notFound(res: Response, message: string = "Resource not found"): void {
    this.error(res, message, null, 404);
  }

  static serverError(res: Response, message: string = "Internal server error", errors?: any): void {
    this.error(res, message, errors, 500);
  }
}
