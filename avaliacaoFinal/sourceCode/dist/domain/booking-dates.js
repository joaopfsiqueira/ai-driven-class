"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todayISODate = todayISODate;
exports.inclusiveDayCount = inclusiveDayCount;
exports.parseBookingDateRange = parseBookingDateRange;
exports.parseVehicleAvailabilityRange = parseVehicleAvailabilityRange;
exports.parseCreateBookingDates = parseCreateBookingDates;
function todayISODate() {
    return new Date().toISOString().slice(0, 10);
}
function inclusiveDayCount(start, end) {
    const a = new Date(start);
    const b = new Date(end);
    const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
}
/** Valida intervalo YYYY-MM-DD para reservas / disponibilidade. */
function parseBookingDateRange(startRaw, endRaw, options = {}) {
    const fs = options.fieldNames?.start ?? "start";
    const fe = options.fieldNames?.end ?? "end";
    const details = [];
    const startTrim = startRaw?.trim() ?? "";
    const endTrim = endRaw?.trim() ?? "";
    if (!startTrim) {
        details.push({ field: fs, message: "Data inicial (YYYY-MM-DD) é obrigatória." });
    }
    if (!endTrim) {
        details.push({ field: fe, message: "Data final (YYYY-MM-DD) é obrigatória." });
    }
    if (details.length > 0) {
        return { ok: false, details };
    }
    const start = new Date(startTrim);
    const end = new Date(endTrim);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
            ok: false,
            details: [
                { field: fs, message: "Formato deve ser YYYY-MM-DD." },
                { field: fe, message: "Formato deve ser YYYY-MM-DD." },
            ],
        };
    }
    if (start > end) {
        return {
            ok: false,
            details: [{ field: fs, message: "start deve ser <= end." }],
        };
    }
    if (options.requireFutureOrTodayStart) {
        const today = todayISODate();
        if (startTrim < today) {
            return {
                ok: false,
                details: [
                    { field: fs, message: `${fs} deve ser uma data futura ou hoje.` },
                ],
            };
        }
    }
    return { ok: true, startDate: startTrim, endDate: endTrim };
}
/** Query `start`/`end` em disponibilidade de veículo (mensagens da API de veículos). */
function parseVehicleAvailabilityRange(startRaw, endRaw) {
    const startTrim = startRaw?.trim() ?? "";
    const endTrim = endRaw?.trim() ?? "";
    if (!startTrim || !endTrim) {
        return {
            ok: false,
            kind: "missing",
            details: [
                { field: "start", message: "Data inicial (YYYY-MM-DD) é obrigatória." },
                { field: "end", message: "Data final (YYYY-MM-DD) é obrigatória." },
            ],
        };
    }
    const start = new Date(startTrim);
    const end = new Date(endTrim);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
            ok: false,
            kind: "format",
            details: [
                { field: "start", message: "Formato deve ser YYYY-MM-DD." },
                { field: "end", message: "Formato deve ser YYYY-MM-DD." },
            ],
        };
    }
    if (start > end) {
        return {
            ok: false,
            kind: "order",
            details: [{ field: "start", message: "start deve ser <= end." }],
        };
    }
    return { ok: true, startDate: startTrim, endDate: endTrim };
}
/** Valida datas do corpo de criação de reserva (mensagens alinhadas à API). */
function parseCreateBookingDates(start_date, end_date) {
    const details = [];
    const startTrim = start_date?.trim() ?? "";
    const endTrim = end_date?.trim() ?? "";
    if (!startTrim) {
        details.push({ field: "start_date", message: "Data de início é obrigatória." });
    }
    if (!endTrim) {
        details.push({ field: "end_date", message: "Data de fim é obrigatória." });
    }
    if (details.length > 0) {
        return { ok: false, details };
    }
    const start = new Date(startTrim);
    const end = new Date(endTrim);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
            ok: false,
            details: [
                { field: "start_date", message: "Formato deve ser YYYY-MM-DD." },
                { field: "end_date", message: "Formato deve ser YYYY-MM-DD." },
            ],
        };
    }
    if (start > end) {
        return {
            ok: false,
            details: [{ field: "start_date", message: "start_date deve ser <= end_date." }],
        };
    }
    const today = todayISODate();
    if (startTrim < today) {
        return {
            ok: false,
            details: [
                { field: "start_date", message: "start_date deve ser uma data futura ou hoje." },
            ],
        };
    }
    return { ok: true, startDate: startTrim, endDate: endTrim };
}
//# sourceMappingURL=booking-dates.js.map