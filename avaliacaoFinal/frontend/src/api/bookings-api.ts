import { UserRole } from "../types/Auth";
import { Booking, CreateBookingInput } from "../types/Booking";
import { api } from "./http-client";
import { unwrapData } from "./json-utils";
import { toBooking } from "./parsers";

export async function listBookings(role: UserRole): Promise<Booking[]> {
  const endpoint = role === "STAFF" ? "/bookings" : "/bookings/me";
  const response = await api.get<unknown>(endpoint);
  const payload = unwrapData<unknown>(response.data);
  if (!Array.isArray(payload)) {
    throw new Error("Resposta inválida ao listar reservas.");
  }
  return payload.map((item) => toBooking(item));
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const payload = {
    vehicle_id: input.vehicleId,
    start_date: input.startDate,
    end_date: input.endDate,
    notes: input.notes.trim() || null,
  };
  const response = await api.post<unknown>("/bookings", payload);
  return toBooking(unwrapData<unknown>(response.data));
}

export async function cancelBooking(bookingId: number): Promise<Booking> {
  const response = await api.patch<unknown>(`/bookings/${bookingId}/cancel`);
  return toBooking(unwrapData<unknown>(response.data));
}
