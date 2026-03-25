"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const app_error_1 = require("../errors/app-error");
const booking_dates_1 = require("../domain/booking-dates");
class BookingService {
    vehicleRepository;
    bookingRepository;
    constructor(vehicleRepository, bookingRepository) {
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
    }
    create(customerId, dto) {
        const parsed = (0, booking_dates_1.parseCreateBookingDates)(dto.start_date, dto.end_date);
        if (!parsed.ok) {
            throw new app_error_1.ValidationError("Dados inválidos.", parsed.details);
        }
        const startDate = parsed.startDate;
        const endDate = parsed.endDate;
        const vehicle = this.vehicleRepository.findById(dto.vehicle_id);
        if (!vehicle) {
            throw new app_error_1.NotFoundError("Veículo não encontrado.");
        }
        if (vehicle.status !== "ACTIVE") {
            throw new app_error_1.ValidationError("Veículo não está disponível para aluguel.");
        }
        const overlapping = this.bookingRepository.findOverlapping(dto.vehicle_id, startDate, endDate, null);
        if (overlapping.length > 0) {
            throw new app_error_1.ConflictError("Já existe reserva para este veículo no período informado.");
        }
        const days = (0, booking_dates_1.inclusiveDayCount)(startDate, endDate);
        const totalAmount = vehicle.daily_rate * days;
        const booking = this.bookingRepository.create({
            customer_id: customerId,
            vehicle_id: dto.vehicle_id,
            start_date: startDate,
            end_date: endDate,
            status: "PENDING",
            notes: dto.notes ?? null,
            total_amount: totalAmount,
            approved_by: null,
            approved_at: null,
        });
        return booking;
    }
    getById(id) {
        return this.bookingRepository.findById(id);
    }
    getByCustomerId(customerId) {
        return this.bookingRepository.findByCustomerId(customerId);
    }
    getAll() {
        return this.bookingRepository.findAll();
    }
    approve(bookingId, staffUserId) {
        const booking = this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new app_error_1.NotFoundError("Reserva não encontrada.");
        }
        if (booking.status !== "PENDING") {
            throw new app_error_1.ValidationError("Apenas reservas pendentes podem ser aprovadas.");
        }
        const overlapping = this.bookingRepository.findOverlapping(booking.vehicle_id, booking.start_date, booking.end_date, bookingId);
        if (overlapping.length > 0) {
            throw new app_error_1.ConflictError("Conflito de datas com outra reserva aprovada ou pendente.");
        }
        const now = new Date().toISOString();
        const updated = this.bookingRepository.update(bookingId, {
            status: "APPROVED",
            approved_by: staffUserId,
            approved_at: now,
        });
        if (!updated)
            throw new app_error_1.NotFoundError("Reserva não encontrada.");
        return updated;
    }
    reject(bookingId, staffUserId) {
        const booking = this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new app_error_1.NotFoundError("Reserva não encontrada.");
        }
        if (booking.status !== "PENDING") {
            throw new app_error_1.ValidationError("Apenas reservas pendentes podem ser rejeitadas.");
        }
        const now = new Date().toISOString();
        const updated = this.bookingRepository.update(bookingId, {
            status: "REJECTED",
            approved_by: staffUserId,
            approved_at: now,
        });
        if (!updated)
            throw new app_error_1.NotFoundError("Reserva não encontrada.");
        return updated;
    }
    cancel(bookingId, customerId) {
        const booking = this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new app_error_1.NotFoundError("Reserva não encontrada.");
        }
        if (booking.customer_id !== customerId) {
            throw new app_error_1.ForbiddenError("Você só pode cancelar suas próprias reservas.");
        }
        if (booking.status === "CANCELED" || booking.status === "REJECTED") {
            throw new app_error_1.ValidationError("Esta reserva não pode ser cancelada.");
        }
        const updated = this.bookingRepository.update(bookingId, { status: "CANCELED" });
        if (!updated)
            throw new app_error_1.NotFoundError("Reserva não encontrada.");
        return updated;
    }
}
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map