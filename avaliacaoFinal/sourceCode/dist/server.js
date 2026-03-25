"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const spec_loader_1 = require("./swagger/spec-loader");
const user_repository_1 = require("./repositories/user.repository");
const customer_repository_1 = require("./repositories/customer.repository");
const vehicle_repository_1 = require("./repositories/vehicle.repository");
const booking_repository_1 = require("./repositories/booking.repository");
const auth_service_1 = require("./services/auth.service");
const vehicle_service_1 = require("./services/vehicle.service");
const booking_service_1 = require("./services/booking.service");
const auth_controller_1 = require("./controllers/auth.controller");
const vehicle_controller_1 = require("./controllers/vehicle.controller");
const booking_controller_1 = require("./controllers/booking.controller");
const auth_routes_1 = require("./routes/auth.routes");
const vehicle_routes_1 = require("./routes/vehicle.routes");
const booking_routes_1 = require("./routes/booking.routes");
const error_middleware_1 = require("./middlewares/error.middleware");
const env_1 = require("./config/env");
const userRepository = new user_repository_1.UserRepository();
const customerRepository = new customer_repository_1.CustomerRepository();
const vehicleRepository = new vehicle_repository_1.VehicleRepository();
const bookingRepository = new booking_repository_1.BookingRepository();
const authService = new auth_service_1.AuthService(userRepository, customerRepository);
const vehicleService = new vehicle_service_1.VehicleService(vehicleRepository, bookingRepository);
const bookingService = new booking_service_1.BookingService(vehicleRepository, bookingRepository);
const authController = new auth_controller_1.AuthController(authService);
const vehicleController = new vehicle_controller_1.VehicleController(vehicleService);
const bookingController = new booking_controller_1.BookingController(bookingService);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/ping", (_req, res) => {
    res.status(200).json({ data: { message: "Serviço funcionando" } });
});
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spec_loader_1.openApiSpec));
app.use("/auth", (0, auth_routes_1.createAuthRoutes)(authController));
app.use("/vehicles", (0, vehicle_routes_1.createVehicleRoutes)(vehicleController));
app.use("/bookings", (0, booking_routes_1.createBookingRoutes)(bookingController));
app.use(error_middleware_1.errorMiddleware);
app.listen(env_1.config.PORT, () => {
    console.log(`API rodando em http://localhost:${env_1.config.PORT}`);
});
//# sourceMappingURL=server.js.map