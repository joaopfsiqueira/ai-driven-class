import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../types/auth-payload";
export interface AuthenticatedRequest extends Request {
    auth?: AuthPayload;
}
export declare function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map