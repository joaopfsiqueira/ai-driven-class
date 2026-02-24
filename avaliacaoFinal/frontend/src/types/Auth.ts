export type UserRole = "CLIENT" | "STAFF";

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  customerId?: number;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
}
