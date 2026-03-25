import { Response, NextFunction } from "express";
import { UserRole } from "../models";
import { AuthenticatedRequest } from "./auth.middleware";
export declare function requireRole(...allowedRoles: UserRole[]): (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map