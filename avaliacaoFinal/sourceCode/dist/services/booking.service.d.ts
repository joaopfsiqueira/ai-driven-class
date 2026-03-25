import { Booking } from "../models";
import { IVehicleRepository } from "../ports/vehicle-repository.port";
import { IBookingRepository } from "../ports/booking-repository.port";
export interface CreateBookingDto {
    vehicle_id: number;
    start_date: string;
    end_date: string;
    notes?: string | null;
}
export declare class BookingService {
    private readonly vehicleRepository;
    private readonly bookingRepository;
    constructor(vehicleRepository: IVehicleRepository, bookingRepository: IBookingRepository);
    create(customerId: number, dto: CreateBookingDto): Booking;
    getById(id: number): Booking | null;
    getByCustomerId(customerId: number): Booking[];
    getAll(): Booking[];
    approve(bookingId: number, staffUserId: number): Booking;
    reject(bookingId: number, staffUserId: number): Booking;
    cancel(bookingId: number, customerId: number): Booking;
}
//# sourceMappingURL=booking.service.d.ts.map