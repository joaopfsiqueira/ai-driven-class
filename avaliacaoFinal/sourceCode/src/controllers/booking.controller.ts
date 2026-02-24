import { Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import { createBookingSchema } from "../validations/booking.validation";
import { ValidationError, NotFoundError } from "../errors/app-error";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  create = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth?.customerId) {
      return next(new ValidationError("Cliente não identificado."));
    }
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return next(new ValidationError("Dados inválidos.", details));
    }
    try {
      const booking = this.bookingService.create(req.auth.customerId, parsed.data);
      res.status(201).json({ data: booking });
    } catch (e) {
      next(e);
    }
  };

  getMyBookings = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.auth?.customerId) {
      return next(new ValidationError("Cliente não identificado."));
    }
    try {
      const bookings = this.bookingService.getByCustomerId(req.auth.customerId);
      res.status(200).json({ data: bookings });
    } catch (e) {
      next(e);
    }
  };

  getAll = (_req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      const bookings = this.bookingService.getAll();
      res.status(200).json({ data: bookings });
    } catch (e) {
      next(e);
    }
  };

  getById = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return next(new ValidationError("ID inválido."));
    }
    try {
      const booking = this.bookingService.getById(id);
      if (!booking) {
        return next(new NotFoundError("Reserva não encontrada."));
      }
      if (req.auth?.role === "CLIENT" && req.auth.customerId !== booking.customer_id) {
        return next(new NotFoundError("Reserva não encontrada."));
      }
      res.status(200).json({ data: booking });
    } catch (e) {
      next(e);
    }
  };

  approve = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) return next(new ValidationError("Não autenticado."));
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return next(new ValidationError("ID inválido."));
    }
    try {
      const booking = this.bookingService.approve(id, req.auth.userId);
      res.status(200).json({ data: booking });
    } catch (e) {
      next(e);
    }
  };

  reject = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) return next(new ValidationError("Não autenticado."));
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return next(new ValidationError("ID inválido."));
    }
    try {
      const booking = this.bookingService.reject(id, req.auth.userId);
      res.status(200).json({ data: booking });
    } catch (e) {
      next(e);
    }
  };

  cancel = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth?.customerId) {
      return next(new ValidationError("Cliente não identificado."));
    }
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return next(new ValidationError("ID inválido."));
    }
    try {
      const booking = this.bookingService.cancel(id, req.auth.customerId);
      res.status(200).json({ data: booking });
    } catch (e) {
      next(e);
    }
  };
}
