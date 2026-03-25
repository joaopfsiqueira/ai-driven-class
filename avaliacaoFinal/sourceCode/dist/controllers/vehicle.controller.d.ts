import { Response, NextFunction } from "express";
import { VehicleService } from "../services/vehicle.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    list: (_req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    getById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    getAvailability: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=vehicle.controller.d.ts.map