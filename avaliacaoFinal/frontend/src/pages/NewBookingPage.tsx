import { BookingForm } from "../components/BookingForm";
import { CreateBookingInput } from "../types/Booking";
import { Vehicle } from "../types/Vehicle";

interface NewBookingPageProps {
  vehicles: Vehicle[];
  selectedVehicleId: number | null;
  isSubmitting: boolean;
  isBookingAllowed: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onSelectVehicle: (vehicleId: number) => void;
  onCreateBooking: (input: CreateBookingInput) => Promise<boolean>;
}

export function NewBookingPage({
  vehicles,
  selectedVehicleId,
  isSubmitting,
  isBookingAllowed,
  errorMessage,
  successMessage,
  onSelectVehicle,
  onCreateBooking,
}: NewBookingPageProps) {
  return (
    <section className="panel page-content">
      <h2>Novo agendamento</h2>
      <BookingForm
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        isSubmitting={isSubmitting}
        isBookingAllowed={isBookingAllowed}
        errorMessage={errorMessage}
        successMessage={successMessage}
        onSelectVehicle={onSelectVehicle}
        onCreateBooking={onCreateBooking}
      />
    </section>
  );
}
