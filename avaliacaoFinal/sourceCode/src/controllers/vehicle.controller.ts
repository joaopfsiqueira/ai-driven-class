import { Response, NextFunction } from "express";
import { VehicleService } from "../services/vehicle.service";
import { ValidationError } from "../errors/app-error";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  list = (_req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      const vehicles = this.vehicleService.list();
      res.status(200).json({ data: vehicles });
    } catch (e) {
      next(e);
    }
  };

  getById = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return next(new ValidationError("ID inválido.", [{ field: "id", message: "ID deve ser um número." }]));
    }
    try {
      const vehicle = this.vehicleService.getById(id);
      res.status(200).json({ data: vehicle });
    } catch (e) {
      next(e);
    }
  };

  getAvailability = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const id = parseInt(req.params.id, 10);
    const start = req.query.start as string;
    const end = req.query.end as string;
    if (isNaN(id)) {
      return next(new ValidationError("ID inválido.", [{ field: "id", message: "ID deve ser um número." }]));
    }
    try {
      const result = this.vehicleService.getAvailability(id, start ?? "", end ?? "");
      res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };
}
