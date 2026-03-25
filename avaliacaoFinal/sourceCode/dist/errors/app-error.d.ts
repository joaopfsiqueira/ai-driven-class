export type ErrorCode = "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "INTERNAL_ERROR";
export interface ValidationDetail {
    field: string;
    message: string;
}
export declare class AppError extends Error {
    readonly code: ErrorCode;
    readonly statusCode: number;
    readonly details: ValidationDetail[];
    constructor(code: ErrorCode, message: string, statusCode: number, details?: ValidationDetail[]);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string, details?: ValidationDetail[]);
}
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: ValidationDetail[]);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=app-error.d.ts.map