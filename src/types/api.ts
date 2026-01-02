/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  timestamp?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/**
 * Search and filter query parameters
 */
export interface SearchQuery extends PaginationQuery {
  search?: string;
  isActive?: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  stack?: string;
}
