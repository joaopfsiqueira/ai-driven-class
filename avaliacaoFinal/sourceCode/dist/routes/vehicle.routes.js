"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVehicleRoutes = createVehicleRoutes;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
function createVehicleRoutes(controller) {
    const router = (0, express_1.Router)();
    router.use(auth_middleware_1.authMiddleware);
    router.get("/", controller.list);
    router.get("/:id", controller.getById);
    router.get("/:id/availability", controller.getAvailability);
    return router;
}
//# sourceMappingURL=vehicle.routes.js.map