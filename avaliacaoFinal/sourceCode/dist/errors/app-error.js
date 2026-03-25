"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.ForbiddenError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    code;
    statusCode;
    details;
    constructor(code, message, statusCode, details = []) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message = "Recurso não encontrado.") {
        super("NOT_FOUND", message, 404);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message, details = []) {
        super("CONFLICT", message, 409, details);
        this.name = "ConflictError";
    }
}
exports.ConflictError = ConflictError;
class ValidationError extends AppError {
    constructor(message = "Dados inválidos.", details = []) {
        super("VALIDATION_ERROR", message, 422, details);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class ForbiddenError extends AppError {
    constructor(message = "Acesso negado.") {
        super("FORBIDDEN", message, 403);
        this.name = "ForbiddenError";
    }
}
exports.ForbiddenError = ForbiddenError;
class UnauthorizedError extends AppError {
    constructor(message = "Não autorizado.") {
        super("UNAUTHORIZED", message, 401);
        this.name = "UnauthorizedError";
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=app-error.js.map