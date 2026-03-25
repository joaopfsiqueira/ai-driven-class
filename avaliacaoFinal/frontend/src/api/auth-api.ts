import { AuthSession, AuthUser, LoginInput } from "../types/Auth";
import { api } from "./http-client";
import { unwrapData } from "./json-utils";
import { toAuthSession, toAuthUser } from "./parsers";

export async function login(input: LoginInput): Promise<AuthSession> {
  const response = await api.post<unknown>("/auth/login", input);
  return toAuthSession(unwrapData<unknown>(response.data));
}

export async function getAuthenticatedUser(): Promise<AuthUser> {
  const response = await api.get<unknown>("/auth/me");
  return toAuthUser(unwrapData<unknown>(response.data));
}
