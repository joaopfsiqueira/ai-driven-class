import { Response, NextFunction } from "express";
import { UserRole } from "../models";
import { ForbiddenError } from "../errors/app-error";
import { AuthenticatedRequest } from "./auth.middleware";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      return next(new ForbiddenError("Autenticação necessária."));
    }
    if (!allowedRoles.includes(req.auth.role)) {
      return next(new ForbiddenError("Você não tem permissão para esta ação."));
    }
    next();
  };
}
