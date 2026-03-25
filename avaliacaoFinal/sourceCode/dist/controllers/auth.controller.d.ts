import { Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    me: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=auth.controller.d.ts.map