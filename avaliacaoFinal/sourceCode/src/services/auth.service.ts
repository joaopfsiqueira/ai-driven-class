import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { UnauthorizedError, ValidationError } from "../errors/app-error";
import { User, UserRole } from "../models";
import { IUserRepository } from "../ports/user-repository.port";
import { ICustomerRepository } from "../ports/customer-repository.port";
import { AuthPayload } from "../types/auth-payload";

export type { AuthPayload };

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: { id: number; email: string; role: UserRole; customerId?: number };
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly customerRepository: ICustomerRepository
  ) {}

  login(dto: LoginDto): LoginResult {
    if (!dto.email?.trim() || !dto.password) {
      throw new ValidationError("Email e senha são obrigatórios.", [
        { field: "email", message: "Email é obrigatório." },
        { field: "password", message: "Senha é obrigatória." },
      ]);
    }
    const user = this.userRepository.findByEmail(dto.email.trim());
    if (!user) {
      throw new UnauthorizedError("Credenciais inválidas.");
    }
    if (!user.is_active) {
      throw new UnauthorizedError("Usuário inativo.");
    }
    const valid = bcrypt.compareSync(dto.password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedError("Credenciais inválidas.");
    }
    const customer = this.customerRepository.findByUserId(user.id);
    const payload: AuthPayload = {
      userId: user.id,
      role: user.role,
      customerId: customer?.id,
    };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "24h" });
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

  me(userId: number): User | null {
    const user = this.userRepository.findById(userId);
    if (!user) return null;
    return { ...user, password_hash: "" } as User;
  }
}
