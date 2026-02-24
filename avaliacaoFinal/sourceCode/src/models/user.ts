export type UserRole = "CLIENT" | "STAFF";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
