import { IVehicleRepository } from "../ports/vehicle-repository.port";
import { IBookingRepository } from "../ports/booking-repository.port";
import { Vehicle } from "../models";
export interface AvailabilityResult {
    available: boolean;
    message?: string;
}
export declare class VehicleService {
    private readonly vehicleRepository;
    private readonly bookingRepository;
    constructor(vehicleRepository: IVehicleRepository, bookingRepository: IBookingRepository);
    list(): Vehicle[];
    getById(id: number): Vehicle;
    getAvailability(vehicleId: number, start: string, end: string): AvailabilityResult;
}
//# sourceMappingURL=vehicle.service.d.ts.map