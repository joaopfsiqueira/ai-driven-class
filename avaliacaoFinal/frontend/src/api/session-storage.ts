import { AuthSession } from "../types/Auth";
import { API_TOKEN, SESSION_STORAGE_KEY } from "./config";
import { setAuthToken } from "./http-client";
import { toAuthSession } from "./parsers";

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
