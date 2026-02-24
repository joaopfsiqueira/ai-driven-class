import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
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
