import { Booking } from "../models";
export interface IBookingRepository {
    findById(id: number): Booking | null;
    findByCustomerId(customerId: number): Booking[];
    findAll(): Booking[];
    findOverlapping(vehicleId: number, startDate: string, endDate: string, excludeBookingId: number | null): Booking[];
    create(booking: Omit<Booking, "id" | "created_at" | "updated_at">): Booking;
    update(id: number, partial: Partial<Pick<Booking, "status" | "notes" | "approved_by" | "approved_at">>): Booking | null;
}
//# sourceMappingURL=booking-repository.port.d.ts.map