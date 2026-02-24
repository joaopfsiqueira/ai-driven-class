import { Booking, BookingStatus } from "../models";
import { bookingsMock } from "../mocks/bookings.mock";

export class BookingRepository {
  private data: Booking[];
  private nextId: number;

  constructor() {
    this.data = bookingsMock.map((b) => ({ ...b }));
    this.nextId = Math.max(0, ...this.data.map((b) => b.id)) + 1;
  }

  findById(id: number): Booking | null {
    return this.data.find((b) => b.id === id) ?? null;
  }

  findByCustomerId(customerId: number): Booking[] {
    return this.data.filter((b) => b.customer_id === customerId).map((b) => ({ ...b }));
  }

  findAll(): Booking[] {
    return this.data.map((b) => ({ ...b }));
  }

  findOverlapping(
    vehicleId: number,
    startDate: string,
    endDate: string,
    excludeBookingId: number | null
  ): Booking[] {
    return this.data.filter((b) => {
      if (b.vehicle_id !== vehicleId) return false;
      if (excludeBookingId !== null && b.id === excludeBookingId) return false;
      if (b.status !== "PENDING" && b.status !== "APPROVED") return false;
      const a1 = b.start_date;
      const b1 = b.end_date;
      const a2 = startDate;
      const b2 = endDate;
      const overlaps = a1 <= b2 && a2 <= b1;
      return overlaps;
    });
  }

  create(booking: Omit<Booking, "id" | "created_at" | "updated_at">): Booking {
    const now = new Date().toISOString();
    const newBooking: Booking = {
      ...booking,
      id: this.nextId++,
      created_at: now,
      updated_at: now,
    };
    this.data.push({ ...newBooking });
    return { ...newBooking };
  }

  update(
    id: number,
    partial: Partial<Pick<Booking, "status" | "notes" | "approved_by" | "approved_at">>
  ): Booking | null {
    const index = this.data.findIndex((b) => b.id === id);
    if (index === -1) return null;
    this.data[index] = {
      ...this.data[index],
      ...partial,
      updated_at: new Date().toISOString(),
    };
    return { ...this.data[index] };
  }
}
