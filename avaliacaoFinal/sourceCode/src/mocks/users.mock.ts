import { User } from "../models";

// Senha para todos no mock: 123456
// Hash bcrypt de "123456" (gerado com bcrypt.hashSync("123456", 10)):
const PASSWORD_HASH =
  "$2b$10$tjOhfd8AeU8DQoNoYjTJSOwQm76acqErmpa7fMrSinPhKQySl/jJ2";

export const usersMock: User[] = [
  {
    id: 1,
    email: "cliente1@email.com",
    password_hash: PASSWORD_HASH,
    role: "CLIENT",
    is_active: true,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    email: "cliente2@email.com",
    password_hash: PASSWORD_HASH,
    role: "CLIENT",
    is_active: true,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    email: "staff@email.com",
    password_hash: PASSWORD_HASH,
    role: "STAFF",
    is_active: true,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z",
  },
];
