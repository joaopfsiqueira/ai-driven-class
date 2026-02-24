import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();
  router.post("/login", controller.login);
  router.get("/me", authMiddleware, controller.me);
  return router;
}
