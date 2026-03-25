import { Booking } from "../models";
import { IVehicleRepository } from "../ports/vehicle-repository.port";
import { IBookingRepository } from "../ports/booking-repository.port";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
  ForbiddenError,
} from "../errors/app-error";
import { inclusiveDayCount, parseCreateBookingDates } from "../domain/booking-dates";

export interface CreateBookingDto {
  vehicle_id: number;
  start_date: string;
  end_date: string;
  notes?: string | null;
}

export class BookingService {
  constructor(
    private readonly vehicleRepository: IVehicleRepository,
    private readonly bookingRepository: IBookingRepository
  ) {}

  create(customerId: number, dto: CreateBookingDto): Booking {
    const parsed = parseCreateBookingDates(dto.start_date, dto.end_date);
    if (!parsed.ok) {
      throw new ValidationError("Dados inválidos.", parsed.details);
    }
    const startDate = parsed.startDate;
    const endDate = parsed.endDate;
    const vehicle = this.vehicleRepository.findById(dto.vehicle_id);
    if (!vehicle) {
      throw new NotFoundError("Veículo não encontrado.");
    }
    if (vehicle.status !== "ACTIVE") {
      throw new ValidationError("Veículo não está disponível para aluguel.");
    }
    const overlapping = this.bookingRepository.findOverlapping(
      dto.vehicle_id,
      startDate,
      endDate,
      null
    );
    if (overlapping.length > 0) {
      throw new ConflictError("Já existe reserva para este veículo no período informado.");
    }
    const days = inclusiveDayCount(startDate, endDate);
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

  getById(id: number): Booking | null {
    return this.bookingRepository.findById(id);
  }

  getByCustomerId(customerId: number): Booking[] {
    return this.bookingRepository.findByCustomerId(customerId);
  }

  getAll(): Booking[] {
    return this.bookingRepository.findAll();
  }

  approve(bookingId: number, staffUserId: number): Booking {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError("Reserva não encontrada.");
    }
    if (booking.status !== "PENDING") {
      throw new ValidationError("Apenas reservas pendentes podem ser aprovadas.");
    }
    const overlapping = this.bookingRepository.findOverlapping(
      booking.vehicle_id,
      booking.start_date,
      booking.end_date,
      bookingId
    );
    if (overlapping.length > 0) {
      throw new ConflictError(
        "Conflito de datas com outra reserva aprovada ou pendente."
      );
    }
    const now = new Date().toISOString();
    const updated = this.bookingRepository.update(bookingId, {
      status: "APPROVED",
      approved_by: staffUserId,
      approved_at: now,
    });
    if (!updated) throw new NotFoundError("Reserva não encontrada.");
    return updated;
  }

  reject(bookingId: number, staffUserId: number): Booking {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError("Reserva não encontrada.");
    }
    if (booking.status !== "PENDING") {
      throw new ValidationError("Apenas reservas pendentes podem ser rejeitadas.");
    }
    const now = new Date().toISOString();
    const updated = this.bookingRepository.update(bookingId, {
      status: "REJECTED",
      approved_by: staffUserId,
      approved_at: now,
    });
    if (!updated) throw new NotFoundError("Reserva não encontrada.");
    return updated;
  }

  cancel(bookingId: number, customerId: number): Booking {
    const booking = this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError("Reserva não encontrada.");
    }
    if (booking.customer_id !== customerId) {
      throw new ForbiddenError("Você só pode cancelar suas próprias reservas.");
    }
    if (booking.status === "CANCELED" || booking.status === "REJECTED") {
      throw new ValidationError("Esta reserva não pode ser cancelada.");
    }
    const updated = this.bookingRepository.update(bookingId, { status: "CANCELED" });
    if (!updated) throw new NotFoundError("Reserva não encontrada.");
    return updated;
  }
}
