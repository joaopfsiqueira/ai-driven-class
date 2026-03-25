"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const app_error_1 = require("../errors/app-error");
class VehicleController {
    vehicleService;
    constructor(vehicleService) {
        this.vehicleService = vehicleService;
    }
    list = (_req, res, next) => {
        try {
            const vehicles = this.vehicleService.list();
            res.status(200).json({ data: vehicles });
        }
        catch (e) {
            next(e);
        }
    };
    getById = (req, res, next) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return next(new app_error_1.ValidationError("ID inválido.", [{ field: "id", message: "ID deve ser um número." }]));
        }
        try {
            const vehicle = this.vehicleService.getById(id);
            res.status(200).json({ data: vehicle });
        }
        catch (e) {
            next(e);
        }
    };
    getAvailability = (req, res, next) => {
        const id = parseInt(req.params.id, 10);
        const start = req.query.start;
        const end = req.query.end;
        if (isNaN(id)) {
            return next(new app_error_1.ValidationError("ID inválido.", [{ field: "id", message: "ID deve ser um número." }]));
        }
        try {
            const result = this.vehicleService.getAvailability(id, start ?? "", end ?? "");
            res.status(200).json({ data: result });
        }
        catch (e) {
            next(e);
        }
    };
}
exports.VehicleController = VehicleController;
//# sourceMappingURL=vehicle.controller.js.map