"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const app_error_1 = require("../errors/app-error");
const booking_dates_1 = require("../domain/booking-dates");
class VehicleService {
    vehicleRepository;
    bookingRepository;
    constructor(vehicleRepository, bookingRepository) {
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
    }
    list() {
        return this.vehicleRepository.findAll();
    }
    getById(id) {
        const vehicle = this.vehicleRepository.findById(id);
        if (!vehicle) {
            throw new app_error_1.NotFoundError("Veículo não encontrado.");
        }
        return vehicle;
    }
    getAvailability(vehicleId, start, end) {
        const vehicle = this.vehicleRepository.findById(vehicleId);
        if (!vehicle) {
            throw new app_error_1.NotFoundError("Veículo não encontrado.");
        }
        const parsed = (0, booking_dates_1.parseVehicleAvailabilityRange)(start, end);
        if (!parsed.ok) {
            const top = parsed.kind === "missing"
                ? "Parâmetros start e end são obrigatórios."
                : parsed.kind === "format"
                    ? "Datas inválidas."
                    : "Data inicial deve ser menor ou igual à final.";
            throw new app_error_1.ValidationError(top, parsed.details);
        }
        const overlapping = this.bookingRepository.findOverlapping(vehicleId, parsed.startDate, parsed.endDate, null);
        const available = overlapping.length === 0;
        return {
            available,
            message: available ? "Veículo disponível no período." : "Veículo ocupado no período.",
        };
    }
}
exports.VehicleService = VehicleService;
//# sourceMappingURL=vehicle.service.js.map