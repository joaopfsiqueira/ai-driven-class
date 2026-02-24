import express from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./swagger/spec-loader";
import { UserRepository } from "./repositories/user.repository";
import { CustomerRepository } from "./repositories/customer.repository";
import { VehicleRepository } from "./repositories/vehicle.repository";
import { BookingRepository } from "./repositories/booking.repository";
import { AuthService } from "./services/auth.service";
import { VehicleService } from "./services/vehicle.service";
import { BookingService } from "./services/booking.service";
import { AuthController } from "./controllers/auth.controller";
import { VehicleController } from "./controllers/vehicle.controller";
import { BookingController } from "./controllers/booking.controller";
import { createAuthRoutes } from "./routes/auth.routes";
import { createVehicleRoutes } from "./routes/vehicle.routes";
import { createBookingRoutes } from "./routes/booking.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { config } from "./config/env";

const userRepository = new UserRepository();
const customerRepository = new CustomerRepository();
const vehicleRepository = new VehicleRepository();
const bookingRepository = new BookingRepository();

const authService = new AuthService(userRepository, customerRepository);
const vehicleService = new VehicleService(vehicleRepository, bookingRepository);
const bookingService = new BookingService(vehicleRepository, bookingRepository);

const authController = new AuthController(authService);
const vehicleController = new VehicleController(vehicleService);
const bookingController = new BookingController(bookingService);

const app = express();
app.use(express.json());

app.get("/ping", (_req, res) => {
  res.status(200).json({ data: { message: "Serviço funcionando" } });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use("/auth", createAuthRoutes(authController));
app.use("/vehicles", createVehicleRoutes(vehicleController));
app.use("/bookings", createBookingRoutes(bookingController));

app.use(errorMiddleware);

app.listen(config.PORT, () => {
  console.log(`API rodando em http://localhost:${config.PORT}`);
});
