import { AuthSession, AuthUser, UserRole } from "../types/Auth";
import { Booking } from "../types/Booking";
import { Vehicle, VehicleStatus } from "../types/Vehicle";
import {
  isRecord,
  parseNullableNumber,
  parseNullableString,
  parseNumber,
  parseString,
} from "./json-utils";

function toVehicleStatus(status: unknown): VehicleStatus {
  if (status === "ACTIVE" || status === "INACTIVE" || status === "MAINTENANCE") {
    return status;
  }
  return "ACTIVE";
}

export function toVehicle(payload: unknown): Vehicle {
  if (!isRecord(payload)) {
    throw new Error("Formato de veículo inválido.");
  }
  const id = parseNumber(payload.id, Number.NaN);
  if (!Number.isFinite(id)) {
    throw new Error("Veículo retornado sem ID.");
  }
  const dailyRateSource = "daily_rate" in payload ? payload.daily_rate : payload.dailyRate;
  return {
    id,
    brand: parseString(payload.brand),
    model: parseString(payload.model),
    plate: parseString(payload.plate),
    year: parseNumber(payload.year),
    category: parseString(payload.category),
    dailyRate: parseNumber(dailyRateSource),
    status: toVehicleStatus(payload.status),
  };
}

function toUserRole(value: unknown): UserRole {
  if (value === "CLIENT" || value === "STAFF") {
    return value;
  }
  return "CLIENT";
}

export function toAuthUser(payload: unknown): AuthUser {
  if (!isRecord(payload)) {
    throw new Error("Formato de usuário inválido.");
  }
  const id = parseNumber(payload.id, Number.NaN);
  if (!Number.isFinite(id)) {
    throw new Error("Usuário retornado sem ID.");
  }
  const customerId = parseNullableNumber(payload.customerId ?? payload.customer_id);
  return {
    id,
    email: parseString(payload.email),
    role: toUserRole(payload.role),
    customerId: customerId ?? undefined,
  };
}

export function toAuthSession(payload: unknown): AuthSession {
  if (!isRecord(payload)) {
    throw new Error("Formato de sessão inválido.");
  }
  return {
    token: parseString(payload.token),
    user: toAuthUser(payload.user),
  };
}

function toBookingStatus(status: unknown): Booking["status"] {
  if (
    status === "PENDING" ||
    status === "APPROVED" ||
    status === "REJECTED" ||
    status === "CANCELED"
  ) {
    return status;
  }
  return "PENDING";
}

export function toBooking(payload: unknown): Booking {
  if (!isRecord(payload)) {
    throw new Error("Formato de reserva inválido.");
  }
  const id = parseNumber(payload.id, Number.NaN);
  if (!Number.isFinite(id)) {
    throw new Error("Reserva retornada sem ID.");
  }
  return {
    id,
    customerId: parseNumber(payload.customer_id),
    vehicleId: parseNumber(payload.vehicle_id),
    startDate: parseString(payload.start_date),
    endDate: parseString(payload.end_date),
    status: toBookingStatus(payload.status),
    notes: parseNullableString(payload.notes),
    totalAmount: parseNullableNumber(payload.total_amount),
    approvedBy: parseNullableNumber(payload.approved_by),
    approvedAt: parseNullableString(payload.approved_at),
    createdAt: parseString(payload.created_at),
    updatedAt: parseString(payload.updated_at),
  };
}
