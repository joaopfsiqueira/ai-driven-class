import { BookingList } from "../components/BookingList";
import { Booking } from "../types/Booking";
import { Vehicle } from "../types/Vehicle";

interface BookingsPageProps {
  title: string;
  bookings: Booking[];
  vehicles: Vehicle[];
  isLoading: boolean;
  errorMessage: string | null;
  cancelingBookingId: number | null;
  canCancel: boolean;
  onCancelBooking: (bookingId: number) => void;
}

export function BookingsPage({
  title,
  bookings,
  vehicles,
  isLoading,
  errorMessage,
  cancelingBookingId,
  canCancel,
  onCancelBooking,
}: BookingsPageProps) {
  return (
    <section className="panel page-content">
      <h2>{title}</h2>
      <BookingList
        bookings={bookings}
        vehicles={vehicles}
        isLoading={isLoading}
        errorMessage={errorMessage}
        cancelingBookingId={cancelingBookingId}
        canCancel={canCancel}
        onCancelBooking={onCancelBooking}
      />
    </section>
  );
}
