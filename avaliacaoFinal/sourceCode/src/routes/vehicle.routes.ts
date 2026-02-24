import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export function createVehicleRoutes(controller: VehicleController): Router {
  const router = Router();
  router.use(authMiddleware);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.get("/:id/availability", controller.getAvailability);
  return router;
}
