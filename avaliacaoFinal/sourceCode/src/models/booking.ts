export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";

export interface Booking {
  id: number;
  customer_id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  notes: string | null;
  total_amount: number | null;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}
