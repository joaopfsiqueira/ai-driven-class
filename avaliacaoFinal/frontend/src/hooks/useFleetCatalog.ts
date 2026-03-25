import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage, listBookings, listVehicles } from "../api";
import { AuthSession } from "../types/Auth";
import { Booking } from "../types/Booking";
import { Vehicle } from "../types/Vehicle";
import { AppPageId } from "../types/AppPage";

export function useFleetCatalog(
  session: AuthSession | null,
  handleUnauthorized: (error: unknown) => boolean
) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<AppPageId>("vehicles");

  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [vehicleErrorMessage, setVehicleErrorMessage] = useState<string | null>(null);
  const [bookingErrorMessage, setBookingErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setVehicles([]);
      setBookings([]);
      setSelectedVehicleId(null);
      setVehicleErrorMessage(null);
      setBookingErrorMessage(null);
      setCurrentPage("vehicles");
    }
  }, [session]);

  const loadVehiclesData = useCallback(
    async (showLoading = true) => {
      if (!session) {
        return;
      }
      if (showLoading) {
        setIsLoadingVehicles(true);
      }
      setVehicleErrorMessage(null);
      try {
        const vehicleList = await listVehicles();
        setVehicles(vehicleList);
      } catch (error) {
        if (!handleUnauthorized(error)) {
          setVehicleErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (showLoading) {
          setIsLoadingVehicles(false);
        }
      }
    },
    [session, handleUnauthorized]
  );

  const loadBookingsData = useCallback(
    async (showLoading = true) => {
      if (!session) {
        return;
      }
      if (showLoading) {
        setIsLoadingBookings(true);
      }
      setBookingErrorMessage(null);
      try {
        const bookingList = await listBookings(session.user.role);
        setBookings(bookingList);
      } catch (error) {
        if (!handleUnauthorized(error)) {
          setBookingErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (showLoading) {
          setIsLoadingBookings(false);
        }
      }
    },
    [session, handleUnauthorized]
  );

  const refreshData = useCallback(async () => {
    if (!session) {
      return;
    }
    await Promise.all([loadVehiclesData(true), loadBookingsData(true)]);
  }, [session, loadVehiclesData, loadBookingsData]);

  useEffect(() => {
    if (!session) {
      return;
    }
    void refreshData();
  }, [session, refreshData]);

  useEffect(() => {
    const activeVehicleIds = vehicles
      .filter((vehicle) => vehicle.status === "ACTIVE")
      .map((vehicle) => vehicle.id);

    if (activeVehicleIds.length === 0) {
      setSelectedVehicleId(null);
      return;
    }

    if (!selectedVehicleId || !activeVehicleIds.includes(selectedVehicleId)) {
      setSelectedVehicleId(activeVehicleIds[0]);
    }
  }, [vehicles, selectedVehicleId]);

  const isBookingAllowed = useMemo(() => {
    if (!session) {
      return false;
    }
    return session.user.role === "CLIENT" && Boolean(session.user.customerId);
  }, [session]);

  useEffect(() => {
    if (!isBookingAllowed && currentPage === "new-booking") {
      setCurrentPage("vehicles");
    }
  }, [isBookingAllowed, currentPage]);

  return {
    vehicles,
    bookings,
    selectedVehicleId,
    setSelectedVehicleId,
    currentPage,
    setCurrentPage,
    isLoadingVehicles,
    isLoadingBookings,
    vehicleErrorMessage,
    bookingErrorMessage,
    setBookingErrorMessage,
    loadVehiclesData,
    loadBookingsData,
    refreshData,
    isBookingAllowed,
  };
}
