"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const app_error_1 = require("../errors/app-error");
function authMiddleware(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return next(new app_error_1.UnauthorizedError("Token não informado."));
    }
    const token = header.slice(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET);
        req.auth = payload;
        next();
    }
    catch {
        next(new app_error_1.UnauthorizedError("Token inválido ou expirado."));
    }
}
//# sourceMappingURL=auth.middleware.js.map