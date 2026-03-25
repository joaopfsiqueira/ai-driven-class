"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_validation_1 = require("../validations/auth.validation");
const app_error_1 = require("../errors/app-error");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login = (req, res, next) => {
        const parsed = auth_validation_1.loginSchema.safeParse(req.body);
        if (!parsed.success) {
            const details = parsed.error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return next(new app_error_1.ValidationError("Dados inválidos.", details));
        }
        try {
            const result = this.authService.login(parsed.data);
            res.status(200).json({ data: result });
        }
        catch (e) {
            next(e);
        }
    };
    me = (req, res, next) => {
        if (!req.auth) {
            return next(new app_error_1.ValidationError("Não autenticado."));
        }
        try {
            const user = this.authService.me(req.auth.userId);
            if (!user) {
                return next(new app_error_1.ValidationError("Usuário não encontrado."));
            }
            res.status(200).json({ data: user });
        }
        catch (e) {
            next(e);
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map