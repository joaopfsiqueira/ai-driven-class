export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export interface ValidationDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number,
    public readonly details: ValidationDetail[] = []
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso não encontrado.") {
    super("NOT_FOUND", message, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details: ValidationDetail[] = []) {
    super("CONFLICT", message, 409, details);
    this.name = "ConflictError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Dados inválidos.", details: ValidationDetail[] = []) {
    super("VALIDATION_ERROR", message, 422, details);
    this.name = "ValidationError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acesso negado.") {
    super("FORBIDDEN", message, 403);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Não autorizado.") {
    super("UNAUTHORIZED", message, 401);
    this.name = "UnauthorizedError";
  }
}
