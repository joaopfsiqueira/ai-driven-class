import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { UnauthorizedError } from "../errors/app-error";
import { AuthPayload } from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  auth?: AuthPayload;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Token não informado."));
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
    req.auth = payload;
    next();
  } catch {
    next(new UnauthorizedError("Token inválido ou expirado."));
  }
}
