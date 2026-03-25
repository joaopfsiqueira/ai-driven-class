"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = createAuthRoutes;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
function createAuthRoutes(controller) {
    const router = (0, express_1.Router)();
    router.post("/login", controller.login);
    router.get("/me", auth_middleware_1.authMiddleware, controller.me);
    return router;
}
//# sourceMappingURL=auth.routes.js.map