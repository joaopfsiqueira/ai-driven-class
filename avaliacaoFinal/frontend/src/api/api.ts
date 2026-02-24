import axios from "axios";
import { AuthSession, AuthUser, LoginInput, UserRole } from "../types/Auth";
import { Booking, CreateBookingInput } from "../types/Booking";
import { Vehicle, VehicleStatus } from "../types/Vehicle";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const SESSION_STORAGE_KEY = "portal-carros-session";

const api = axios.create({
  baseURL: API_BASE_URL,
});

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function parseString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function parseNullableString(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }
  return null;
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function parseNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  const parsed = parseNumber(value, Number.NaN);
  return Number.isFinite(parsed) ? parsed : null;
}

function unwrapData<T>(payload: unknown): T {
  if (isRecord(payload) && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
}

function toVehicleStatus(status: unknown): VehicleStatus {
  if (status === "ACTIVE" || status === "INACTIVE" || status === "MAINTENANCE") {
    return status;
  }
  return "ACTIVE";
}

function toVehicle(payload: unknown): Vehicle {
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

function toAuthUser(payload: unknown): AuthUser {
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

function toAuthSession(payload: unknown): AuthSession {
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

function toBooking(payload: unknown): Booking {
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

function extractErrorMessage(data: unknown): string | null {
  if (!isRecord(data)) {
    return null;
  }
  if (typeof data.message === "string" && data.message.length > 0) {
    return data.message;
  }
  if (isRecord(data.error) && typeof data.error.message === "string") {
    return data.error.message;
  }
  return null;
}

export function setAuthToken(token: string | null): void {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }
  delete api.defaults.headers.common.Authorization;
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  setAuthToken(session.token);
}

export function loadSession(): AuthSession | null {
  const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawSession) {
    if (API_TOKEN) {
      setAuthToken(API_TOKEN);
    }
    return null;
  }
  try {
    const session = toAuthSession(JSON.parse(rawSession));
    setAuthToken(session.token);
    return session;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  setAuthToken(API_TOKEN ?? null);
}

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = extractErrorMessage(error.response?.data);
    if (message) {
      return message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Não foi possível completar a operação.";
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const response = await api.post<unknown>("/auth/login", input);
  return toAuthSession(unwrapData<unknown>(response.data));
}

export async function getAuthenticatedUser(): Promise<AuthUser> {
  const response = await api.get<unknown>("/auth/me");
  return toAuthUser(unwrapData<unknown>(response.data));
}

export async function listVehicles(): Promise<Vehicle[]> {
  const response = await api.get<unknown>("/vehicles");
  const payload = unwrapData<unknown>(response.data);
  if (!Array.isArray(payload)) {
    throw new Error("Resposta inválida ao listar veículos.");
  }
  return payload.map((item) => toVehicle(item));
}

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
