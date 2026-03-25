import { Booking } from "../models";
import { IBookingRepository } from "../ports/booking-repository.port";
export declare class BookingRepository implements IBookingRepository {
    private data;
    private nextId;
    constructor();
    findById(id: number): Booking | null;
    findByCustomerId(customerId: number): Booking[];
    findAll(): Booking[];
    findOverlapping(vehicleId: number, startDate: string, endDate: string, excludeBookingId: number | null): Booking[];
    create(booking: Omit<Booking, "id" | "created_at" | "updated_at">): Booking;
    update(id: number, partial: Partial<Pick<Booking, "status" | "notes" | "approved_by" | "approved_at">>): Booking | null;
}
//# sourceMappingURL=booking.repository.d.ts.map