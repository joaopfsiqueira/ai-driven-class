export type DateRangeFieldError = {
    field: string;
    message: string;
};
export type DateRangeParseResult = {
    ok: true;
    startDate: string;
    endDate: string;
} | {
    ok: false;
    details: DateRangeFieldError[];
};
export type VehicleAvailabilityParseResult = {
    ok: true;
    startDate: string;
    endDate: string;
} | {
    ok: false;
    kind: "missing" | "format" | "order";
    details: DateRangeFieldError[];
};
export declare function todayISODate(): string;
export declare function inclusiveDayCount(start: string, end: string): number;
export type ParseDateRangeOptions = {
    requireFutureOrTodayStart?: boolean;
    /** Nomes dos campos na API (query vs body). */
    fieldNames?: {
        start: string;
        end: string;
    };
};
/** Valida intervalo YYYY-MM-DD para reservas / disponibilidade. */
export declare function parseBookingDateRange(startRaw: string | undefined, endRaw: string | undefined, options?: ParseDateRangeOptions): DateRangeParseResult;
/** Query `start`/`end` em disponibilidade de veículo (mensagens da API de veículos). */
export declare function parseVehicleAvailabilityRange(startRaw: string | undefined, endRaw: string | undefined): VehicleAvailabilityParseResult;
/** Valida datas do corpo de criação de reserva (mensagens alinhadas à API). */
export declare function parseCreateBookingDates(start_date?: string, end_date?: string): DateRangeParseResult;
//# sourceMappingURL=booking-dates.d.ts.map