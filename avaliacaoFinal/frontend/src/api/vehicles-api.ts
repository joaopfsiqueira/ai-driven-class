import { Vehicle } from "../types/Vehicle";
import { api } from "./http-client";
import { unwrapData } from "./json-utils";
import { toVehicle } from "./parsers";

export async function listVehicles(): Promise<Vehicle[]> {
  const response = await api.get<unknown>("/vehicles");
  const payload = unwrapData<unknown>(response.data);
  if (!Array.isArray(payload)) {
    throw new Error("Resposta inválida ao listar veículos.");
  }
  return payload.map((item) => toVehicle(item));
}
