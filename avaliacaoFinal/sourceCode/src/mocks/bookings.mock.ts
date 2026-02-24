import { Booking } from "../models";

export const bookingsMock: Booking[] = [
  {
    id: 1,
    customer_id: 1,
    vehicle_id: 1,
    start_date: "2025-03-10",
    end_date: "2025-03-12",
    status: "PENDING",
    notes: "Primeira reserva",
    total_amount: 450.0,
    approved_by: null,
    approved_at: null,
    created_at: "2025-02-01T10:00:00.000Z",
    updated_at: "2025-02-01T10:00:00.000Z",
  },
  {
    id: 2,
    customer_id: 2,
    vehicle_id: 2,
    start_date: "2025-03-15",
    end_date: "2025-03-18",
    status: "APPROVED",
    notes: null,
    total_amount: 660.0,
    approved_by: 3,
    approved_at: "2025-02-02T14:00:00.000Z",
    created_at: "2025-02-02T09:00:00.000Z",
    updated_at: "2025-02-02T14:00:00.000Z",
  },
];
