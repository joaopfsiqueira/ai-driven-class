import { IVehicleRepository } from "../ports/vehicle-repository.port";
import { IBookingRepository } from "../ports/booking-repository.port";
import { Vehicle } from "../models";
import { NotFoundError, ValidationError } from "../errors/app-error";
import { parseVehicleAvailabilityRange } from "../domain/booking-dates";

export interface AvailabilityResult {
  available: boolean;
  message?: string;
}

export class VehicleService {
  constructor(
    private readonly vehicleRepository: IVehicleRepository,
    private readonly bookingRepository: IBookingRepository
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
    const parsed = parseVehicleAvailabilityRange(start, end);
    if (!parsed.ok) {
      const top =
        parsed.kind === "missing"
          ? "Parâmetros start e end são obrigatórios."
          : parsed.kind === "format"
            ? "Datas inválidas."
            : "Data inicial deve ser menor ou igual à final.";
      throw new ValidationError(top, parsed.details);
    }
    const overlapping = this.bookingRepository.findOverlapping(
      vehicleId,
      parsed.startDate,
      parsed.endDate,
      null
    );
    const available = overlapping.length === 0;
    return {
      available,
      message: available ? "Veículo disponível no período." : "Veículo ocupado no período.",
    };
  }
}
