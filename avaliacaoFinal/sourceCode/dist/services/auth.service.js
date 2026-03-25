"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const app_error_1 = require("../errors/app-error");
class AuthService {
    userRepository;
    customerRepository;
    constructor(userRepository, customerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }
    login(dto) {
        if (!dto.email?.trim() || !dto.password) {
            throw new app_error_1.ValidationError("Email e senha são obrigatórios.", [
                { field: "email", message: "Email é obrigatório." },
                { field: "password", message: "Senha é obrigatória." },
            ]);
        }
        const user = this.userRepository.findByEmail(dto.email.trim());
        if (!user) {
            throw new app_error_1.UnauthorizedError("Credenciais inválidas.");
        }
        if (!user.is_active) {
            throw new app_error_1.UnauthorizedError("Usuário inativo.");
        }
        const valid = bcrypt_1.default.compareSync(dto.password, user.password_hash);
        if (!valid) {
            throw new app_error_1.UnauthorizedError("Credenciais inválidas.");
        }
        const customer = this.customerRepository.findByUserId(user.id);
        const payload = {
            userId: user.id,
            role: user.role,
            customerId: customer?.id,
        };
        const token = jsonwebtoken_1.default.sign(payload, env_1.config.JWT_SECRET, { expiresIn: "24h" });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                customerId: customer?.id,
            },
        };
    }
    me(userId) {
        const user = this.userRepository.findById(userId);
        if (!user)
            return null;
        return { ...user, password_hash: "" };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map