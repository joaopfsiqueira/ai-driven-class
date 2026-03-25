import { useState } from "react";
import { cancelBooking, createBooking, getErrorMessage } from "../api";
import { CreateBookingInput } from "../types/Booking";

type Params = {
  loadBookingsData: (showLoading?: boolean) => Promise<void>;
  handleUnauthorized: (error: unknown) => boolean;
  onBookingListError: (message: string | null) => void;
};

export function useBookingMutations({
  loadBookingsData,
  handleUnauthorized,
  onBookingListError,
}: Params) {
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [isCancelingBookingId, setIsCancelingBookingId] = useState<number | null>(null);
  const [bookingFormErrorMessage, setBookingFormErrorMessage] = useState<string | null>(null);
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);

  const handleCreateBooking = async (input: CreateBookingInput): Promise<boolean> => {
    setIsCreatingBooking(true);
    setBookingFormErrorMessage(null);
    setBookingSuccessMessage(null);

    try {
      await createBooking(input);
      setBookingSuccessMessage("Agendamento criado com sucesso.");
      await loadBookingsData(false);
      return true;
    } catch (error) {
      if (handleUnauthorized(error)) {
        return false;
      }
      setBookingFormErrorMessage(getErrorMessage(error));
      return false;
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    const shouldCancel = window.confirm("Tem certeza que deseja cancelar esta reserva?");
    if (!shouldCancel) {
      return;
    }

    setIsCancelingBookingId(bookingId);
    onBookingListError(null);

    try {
      await cancelBooking(bookingId);
      setBookingSuccessMessage("Reserva cancelada com sucesso.");
      await loadBookingsData(false);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        onBookingListError(getErrorMessage(error));
      }
    } finally {
      setIsCancelingBookingId(null);
    }
  };

  return {
    isCreatingBooking,
    isCancelingBookingId,
    bookingFormErrorMessage,
    bookingSuccessMessage,
    handleCreateBooking,
    handleCancelBooking,
  };
}
