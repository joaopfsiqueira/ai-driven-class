import { Customer } from "../models";

export const customersMock: Customer[] = [
  {
    id: 1,
    user_id: 1,
    full_name: "Maria Cliente",
    document: "111.222.333-44",
    phone: "(11) 99999-1111",
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    user_id: 2,
    full_name: "João Cliente",
    document: "555.666.777-88",
    phone: "(11) 99999-2222",
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z",
  },
];
