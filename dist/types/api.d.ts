export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    pagination?: PaginationMeta;
    timestamp?: string;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
}
export interface SearchQuery extends PaginationQuery {
    search?: string;
    isActive?: string;
}
export interface ErrorResponse {
    success: false;
    message: string;
    errors?: any[];
    stack?: string;
}
//# sourceMappingURL=api.d.ts.map