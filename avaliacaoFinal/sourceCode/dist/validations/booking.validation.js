"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = void 0;
const zod_1 = require("zod");
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
exports.createBookingSchema = zod_1.z.object({
    vehicle_id: zod_1.z.number().int().positive("vehicle_id deve ser um ID válido."),
    start_date: zod_1.z
        .string()
        .min(1, "start_date é obrigatório.")
        .regex(dateRegex, "Formato deve ser YYYY-MM-DD."),
    end_date: zod_1.z
        .string()
        .min(1, "end_date é obrigatório.")
        .regex(dateRegex, "Formato deve ser YYYY-MM-DD."),
    notes: zod_1.z.string().nullable().optional(),
});
//# sourceMappingURL=booking.validation.js.map