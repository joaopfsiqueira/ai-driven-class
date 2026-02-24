import { Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { loginSchema } from "../validations/auth.validation";
import { ValidationError } from "../errors/app-error";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return next(new ValidationError("Dados inválidos.", details));
    }
    try {
      const result = this.authService.login(parsed.data);
      res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };

  me = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      return next(new ValidationError("Não autenticado."));
    }
    try {
      const user = this.authService.me(req.auth.userId);
      if (!user) {
        return next(new ValidationError("Usuário não encontrado."));
      }
      res.status(200).json({ data: user });
    } catch (e) {
      next(e);
    }
  };
}
