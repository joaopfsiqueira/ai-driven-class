"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const app_error_1 = require("../errors/app-error");
function requireRole(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.auth) {
            return next(new app_error_1.ForbiddenError("Autenticação necessária."));
        }
        if (!allowedRoles.includes(req.auth.role)) {
            return next(new app_error_1.ForbiddenError("Você não tem permissão para esta ação."));
        }
        next();
    };
}
//# sourceMappingURL=rbac.middleware.js.map