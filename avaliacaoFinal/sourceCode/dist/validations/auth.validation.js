"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().min(1, "Email é obrigatório.").email("Email inválido."),
    password: zod_1.z.string().min(1, "Senha é obrigatória."),
});
//# sourceMappingURL=auth.validation.js.map