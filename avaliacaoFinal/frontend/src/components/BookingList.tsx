import { Booking } from "../types/Booking";
import { Vehicle } from "../types/Vehicle";

interface BookingListProps {
  bookings: Booking[];
  vehicles: Vehicle[];
  isLoading: boolean;
  errorMessage: string | null;
  cancelingBookingId: number | null;
  canCancel: boolean;
  onCancelBooking: (bookingId: number) => void;
}

export function BookingList({
  bookings,
  vehicles,
  isLoading,
  errorMessage,
  cancelingBookingId,
  canCancel,
  onCancelBooking,
}: BookingListProps) {
  if (isLoading) {
    return <p className="info-message">Carregando reservas...</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  if (bookings.length === 0) {
    return <p className="info-message">Nenhuma reserva encontrada.</p>;
  }

  const vehiclesById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));

  return (
    <div className="booking-list">
      {bookings.map((booking) => {
        const vehicle = vehiclesById.get(booking.vehicleId);
        const canBeCanceled =
          canCancel &&
          (booking.status === "PENDING" || booking.status === "APPROVED");

        return (
          <article key={booking.id} className="booking-card">
            <div className="vehicle-card__header">
              <h3>Reserva #{booking.id}</h3>
              <span className={`status-pill status-pill--${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>

            <p>
              <strong>Veículo:</strong>{" "}
              {vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : "Não encontrado"}
            </p>
            <p>
              <strong>Período:</strong> {booking.startDate} até {booking.endDate}
            </p>
            <p>
              <strong>Valor total:</strong>{" "}
              {booking.totalAmount !== null ? `R$ ${booking.totalAmount.toFixed(2)}` : "-"}
            </p>
            <p>
              <strong>Observações:</strong> {booking.notes ?? "-"}
            </p>

            {canBeCanceled ? (
              <button
                type="button"
                className="danger-button"
                disabled={cancelingBookingId === booking.id}
                onClick={() => onCancelBooking(booking.id)}
              >
                {cancelingBookingId === booking.id ? "Cancelando..." : "Cancelar reserva"}
              </button>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
