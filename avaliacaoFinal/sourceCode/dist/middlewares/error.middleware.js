"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const app_error_1 = require("../errors/app-error");
function errorMiddleware(err, _req, res, _next) {
    if (err instanceof app_error_1.AppError) {
        res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details ?? [],
            },
        });
        return;
    }
    console.error(err);
    res.status(500).json({
        error: {
            code: "INTERNAL_ERROR",
            message: "Erro interno do servidor.",
            details: [],
        },
    });
}
//# sourceMappingURL=error.middleware.js.map