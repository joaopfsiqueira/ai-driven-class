import axios from "axios";
import { CreateVehicleInput, Vehicle } from "../types/Vehicle";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: API_TOKEN
    ? {
        Authorization: `Bearer ${API_TOKEN}`,
      }
    : undefined,
});

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function parseString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
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

function unwrapData<T>(payload: unknown): T {
  if (isRecord(payload) && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
}

function toVehicle(payload: unknown): Vehicle {
  if (!isRecord(payload)) {
    throw new Error("Formato de veículo inválido.");
  }

  const idValue = payload.id;
  if (typeof idValue !== "number" && typeof idValue !== "string") {
    throw new Error("Veículo retornado sem ID.");
  }

  const dailyRateSource = "dailyRate" in payload ? payload.dailyRate : payload.daily_rate;

  return {
    id: String(idValue),
    brand: parseString(payload.brand),
    model: parseString(payload.model),
    plate: parseString(payload.plate),
    dailyRate: parseNumber(dailyRateSource),
    status: parseString(payload.status, "ACTIVE"),
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

export async function listVehicles(): Promise<Vehicle[]> {
  const response = await api.get<unknown>("/vehicles");
  const payload = unwrapData<unknown>(response.data);

  if (!Array.isArray(payload)) {
    throw new Error("Resposta inválida ao listar veículos.");
  }

  return payload.map((item) => toVehicle(item));
}

export async function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  const payload = {
    plate: input.plate,
    brand: input.brand,
    model: input.model,
    status: input.status,
    dailyRate: input.dailyRate,
    daily_rate: input.dailyRate,
    year: new Date().getFullYear(),
    category: "HATCH",
  };

  const response = await api.post<unknown>("/vehicles", payload);
  const created = unwrapData<unknown>(response.data);
  return toVehicle(created);
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
  await api.delete(`/vehicles/${vehicleId}`);
}
