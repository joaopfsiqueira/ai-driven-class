import { VehicleRepository } from "../repositories/vehicle.repository";
import { BookingRepository } from "../repositories/booking.repository";
import { Vehicle } from "../models";
import { NotFoundError, ValidationError } from "../errors/app-error";

export interface AvailabilityResult {
  available: boolean;
  message?: string;
}

export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly bookingRepository: BookingRepository
  ) {}

  list(): Vehicle[] {
    return this.vehicleRepository.findAll();
  }

  getById(id: number): Vehicle {
    const vehicle = this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError("Veículo não encontrado.");
    }
    return vehicle;
  }

  getAvailability(
    vehicleId: number,
    start: string,
    end: string
  ): AvailabilityResult {
    const vehicle = this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundError("Veículo não encontrado.");
    }
    if (!start || !end) {
      throw new ValidationError("Parâmetros start e end são obrigatórios.", [
        { field: "start", message: "Data inicial (YYYY-MM-DD) é obrigatória." },
        { field: "end", message: "Data final (YYYY-MM-DD) é obrigatória." },
      ]);
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new ValidationError("Datas inválidas.", [
        { field: "start", message: "Formato deve ser YYYY-MM-DD." },
        { field: "end", message: "Formato deve ser YYYY-MM-DD." },
      ]);
    }
    if (startDate > endDate) {
      throw new ValidationError("Data inicial deve ser menor ou igual à final.", [
        { field: "start", message: "start deve ser <= end." },
      ]);
    }
    const overlapping = this.bookingRepository.findOverlapping(
      vehicleId,
      start,
      end,
      null
    );
    const available = overlapping.length === 0;
    return {
      available,
      message: available ? "Veículo disponível no período." : "Veículo ocupado no período.",
    };
  }
}
