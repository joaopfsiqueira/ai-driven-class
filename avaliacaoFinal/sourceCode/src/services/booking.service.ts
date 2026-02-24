import { Booking, BookingStatus } from "../models";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { BookingRepository } from "../repositories/booking.repository";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
  ForbiddenError,
} from "../errors/app-error";

export interface CreateBookingDto {
  vehicle_id: number;
  start_date: string;
  end_date: string;
  notes?: string | null;
}

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string): number {
  const a = new Date(start);
  const b = new Date(end);
  const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

export class BookingService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly bookingRepository: BookingRepository
  ) {}

  create(customerId: number, dto: CreateBookingDto): Booking {
    const details: { field: string; message: string }[] = [];
    if (!dto.start_date?.trim()) {
      details.push({ field: "start_date", message: "Data de início é obrigatória." });
    }
    if (!dto.end_date?.trim()) {
      details.push({ field: "end_date", message: "Data de fim é obrigatória." });
    }
    if (details.length > 0) {
      throw new ValidationError("Dados inválidos.", details);
    }
    const startDate = dto.start_date.trim();
    const endDate = dto.end_date.trim();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ValidationError("Datas inválidas.", [
        { field: "start_date", message: "Formato deve ser YYYY-MM-DD." },
        { field: "end_date", message: "Formato deve ser YYYY-MM-DD." },
      ]);
    }
    if (start > end) {
      throw new ValidationError("start_date deve ser menor ou igual a end_date.", [
        { field: "start_date", message: "start_date deve ser <= end_date." },
      ]);
    }
    const today = todayISO();
    if (startDate < today) {
      throw new ValidationError("Não é permitido reserva retroativa.", [
        { field: "start_date", message: "start_date deve ser uma data futura ou hoje." },
      ]);
    }
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
    const days = daysBetween(startDate, endDate);
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
