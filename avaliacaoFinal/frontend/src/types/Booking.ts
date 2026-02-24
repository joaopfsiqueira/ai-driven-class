export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";

export interface Booking {
  id: number;
  customerId: number;
  vehicleId: number;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  notes: string | null;
  totalAmount: number | null;
  approvedBy: number | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  vehicleId: number;
  startDate: string;
  endDate: string;
  notes: string;
}
