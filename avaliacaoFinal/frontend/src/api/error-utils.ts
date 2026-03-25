import axios from "axios";
import { isRecord } from "./json-utils";

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
