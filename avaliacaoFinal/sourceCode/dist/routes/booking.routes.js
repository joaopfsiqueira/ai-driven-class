"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingRoutes = createBookingRoutes;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
function createBookingRoutes(controller) {
    const router = (0, express_1.Router)();
    router.use(auth_middleware_1.authMiddleware);
    router.post("/", controller.create);
    router.get("/me", controller.getMyBookings);
    router.get("/", (0, rbac_middleware_1.requireRole)("STAFF"), controller.getAll);
    router.get("/:id", controller.getById);
    router.patch("/:id/approve", (0, rbac_middleware_1.requireRole)("STAFF"), controller.approve);
    router.patch("/:id/reject", (0, rbac_middleware_1.requireRole)("STAFF"), controller.reject);
    router.patch("/:id/cancel", controller.cancel);
    return router;
}
//# sourceMappingURL=booking.routes.js.map