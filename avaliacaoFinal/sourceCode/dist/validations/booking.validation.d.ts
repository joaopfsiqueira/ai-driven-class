import { z } from "zod";
export declare const createBookingSchema: z.ZodObject<{
    vehicle_id: z.ZodNumber;
    start_date: z.ZodString;
    end_date: z.ZodString;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    vehicle_id: number;
    start_date: string;
    end_date: string;
    notes?: string | null | undefined;
}, {
    vehicle_id: number;
    start_date: string;
    end_date: string;
    notes?: string | null | undefined;
}>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
//# sourceMappingURL=booking.validation.d.ts.map