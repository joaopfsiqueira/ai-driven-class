"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const booking_validation_1 = require("../validations/booking.validation");
const app_error_1 = require("../errors/app-error");
class BookingController {
    bookingService;
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    create = (req, res, next) => {
        if (!req.auth?.customerId) {
            return next(new app_error_1.ValidationError("Cliente não identificado."));
        }
        const parsed = booking_validation_1.createBookingSchema.safeParse(req.body);
        if (!parsed.success) {
            const details = parsed.error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return next(new app_error_1.ValidationError("Dados inválidos.", details));
        }
        try {
            const booking = this.bookingService.create(req.auth.customerId, parsed.data);
            res.status(201).json({ data: booking });
        }
        catch (e) {
            next(e);
        }
    };
    getMyBookings = (req, res, next) => {
        if (!req.auth?.customerId) {
            return next(new app_error_1.ValidationError("Cliente não identificado."));
        }
        try {
            const bookings = this.bookingService.getByCustomerId(req.auth.customerId);
            res.status(200).json({ data: bookings });
        }
        catch (e) {
            next(e);
        }
    };
    getAll = (_req, res, next) => {
        try {
            const bookings = this.bookingService.getAll();
            res.status(200).json({ data: bookings });
        }
        catch (e) {
            next(e);
        }
    };
    getById = (req, res, next) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return next(new app_error_1.ValidationError("ID inválido."));
        }
        try {
            const booking = this.bookingService.getById(id);
            if (!booking) {
                return next(new app_error_1.NotFoundError("Reserva não encontrada."));
            }
            if (req.auth?.role === "CLIENT" && req.auth.customerId !== booking.customer_id) {
                return next(new app_error_1.NotFoundError("Reserva não encontrada."));
            }
            res.status(200).json({ data: booking });
        }
        catch (e) {
            next(e);
        }
    };
    approve = (req, res, next) => {
        if (!req.auth)
            return next(new app_error_1.ValidationError("Não autenticado."));
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return next(new app_error_1.ValidationError("ID inválido."));
        }
        try {
            const booking = this.bookingService.approve(id, req.auth.userId);
            res.status(200).json({ data: booking });
        }
        catch (e) {
            next(e);
        }
    };
    reject = (req, res, next) => {
        if (!req.auth)
            return next(new app_error_1.ValidationError("Não autenticado."));
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return next(new app_error_1.ValidationError("ID inválido."));
        }
        try {
            const booking = this.bookingService.reject(id, req.auth.userId);
            res.status(200).json({ data: booking });
        }
        catch (e) {
            next(e);
        }
    };
    cancel = (req, res, next) => {
        if (!req.auth?.customerId) {
            return next(new app_error_1.ValidationError("Cliente não identificado."));
        }
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return next(new app_error_1.ValidationError("ID inválido."));
        }
        try {
            const booking = this.bookingService.cancel(id, req.auth.customerId);
            res.status(200).json({ data: booking });
        }
        catch (e) {
            next(e);
        }
    };
}
exports.BookingController = BookingController;
//# sourceMappingURL=booking.controller.js.map