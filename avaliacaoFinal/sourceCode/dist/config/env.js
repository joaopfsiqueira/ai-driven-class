"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET ?? "mvp-secret-change-in-production";
const PORT = parseInt(process.env.PORT ?? "3001", 10);
exports.config = {
    JWT_SECRET,
    PORT,
};
//# sourceMappingURL=env.js.map