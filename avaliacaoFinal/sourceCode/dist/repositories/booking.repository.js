"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const bookings_mock_1 = require("../mocks/bookings.mock");
class BookingRepository {
    data;
    nextId;
    constructor() {
        this.data = bookings_mock_1.bookingsMock.map((b) => ({ ...b }));
        this.nextId = Math.max(0, ...this.data.map((b) => b.id)) + 1;
    }
    findById(id) {
        return this.data.find((b) => b.id === id) ?? null;
    }
    findByCustomerId(customerId) {
        return this.data.filter((b) => b.customer_id === customerId).map((b) => ({ ...b }));
    }
    findAll() {
        return this.data.map((b) => ({ ...b }));
    }
    findOverlapping(vehicleId, startDate, endDate, excludeBookingId) {
        return this.data.filter((b) => {
            if (b.vehicle_id !== vehicleId)
                return false;
            if (excludeBookingId !== null && b.id === excludeBookingId)
                return false;
            if (b.status !== "PENDING" && b.status !== "APPROVED")
                return false;
            const a1 = b.start_date;
            const b1 = b.end_date;
            const a2 = startDate;
            const b2 = endDate;
            const overlaps = a1 <= b2 && a2 <= b1;
            return overlaps;
        });
    }
    create(booking) {
        const now = new Date().toISOString();
        const newBooking = {
            ...booking,
            id: this.nextId++,
            created_at: now,
            updated_at: now,
        };
        this.data.push({ ...newBooking });
        return { ...newBooking };
    }
    update(id, partial) {
        const index = this.data.findIndex((b) => b.id === id);
        if (index === -1)
            return null;
        this.data[index] = {
            ...this.data[index],
            ...partial,
            updated_at: new Date().toISOString(),
        };
        return { ...this.data[index] };
    }
}
exports.BookingRepository = BookingRepository;
//# sourceMappingURL=booking.repository.js.map