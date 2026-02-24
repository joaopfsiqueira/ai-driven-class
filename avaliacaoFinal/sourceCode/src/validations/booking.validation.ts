import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createBookingSchema = z.object({
  vehicle_id: z.number().int().positive("vehicle_id deve ser um ID válido."),
  start_date: z
    .string()
    .min(1, "start_date é obrigatório.")
    .regex(dateRegex, "Formato deve ser YYYY-MM-DD."),
  end_date: z
    .string()
    .min(1, "end_date é obrigatório.")
    .regex(dateRegex, "Formato deve ser YYYY-MM-DD."),
  notes: z.string().nullable().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
