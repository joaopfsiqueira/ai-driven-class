import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac.middleware";

export function createBookingRoutes(controller: BookingController): Router {
  const router = Router();
  router.use(authMiddleware);

  router.post("/", controller.create);
  router.get("/me", controller.getMyBookings);
  router.get("/", requireRole("STAFF"), controller.getAll);
  router.get("/:id", controller.getById);
  router.patch("/:id/approve", requireRole("STAFF"), controller.approve);
  router.patch("/:id/reject", requireRole("STAFF"), controller.reject);
  router.patch("/:id/cancel", controller.cancel);

  return router;
}
