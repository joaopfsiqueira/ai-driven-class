import { Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    getMyBookings: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    getAll: (_req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    getById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    approve: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    reject: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    cancel: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=booking.controller.d.ts.map