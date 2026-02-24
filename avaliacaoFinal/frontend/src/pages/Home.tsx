import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cancelBooking,
  clearSession,
  createBooking,
  getAuthenticatedUser,
  getErrorMessage,
  isUnauthorizedError,
  listBookings,
  listVehicles,
  loadSession,
  login,
  saveSession,
} from "../api/api";
import { BookingForm } from "../components/BookingForm";
import { BookingList } from "../components/BookingList";
import { LoginForm } from "../components/LoginForm";
import { VehicleList } from "../components/VehicleList";
import { AuthSession, LoginInput } from "../types/Auth";
import { Booking, CreateBookingInput } from "../types/Booking";
import { Vehicle } from "../types/Vehicle";

export function Home() {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [vehicleErrorMessage, setVehicleErrorMessage] = useState<string | null>(null);
  const [bookingErrorMessage, setBookingErrorMessage] = useState<string | null>(null);

  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [isCancelingBookingId, setIsCancelingBookingId] = useState<number | null>(null);
  const [bookingFormErrorMessage, setBookingFormErrorMessage] = useState<string | null>(null);
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);

  const clearAllData = useCallback(() => {
    setVehicles([]);
    setBookings([]);
    setSelectedVehicleId(null);
    setVehicleErrorMessage(null);
    setBookingErrorMessage(null);
    setBookingFormErrorMessage(null);
    setBookingSuccessMessage(null);
  }, []);

  const clearCurrentSession = useCallback(() => {
    clearSession();
    setSession(null);
    clearAllData();
  }, [clearAllData]);

  const handleUnauthorized = useCallback(
    (error: unknown): boolean => {
      if (!isUnauthorizedError(error)) {
        return false;
      }
      clearCurrentSession();
      setAuthErrorMessage("Sua sessão expirou. Faça login novamente.");
      return true;
    },
    [clearCurrentSession]
  );

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
    if (!session?.token) {
      setIsCheckingSession(false);
      return;
    }

    let isMounted = true;
    setIsCheckingSession(true);

    void (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!isMounted) {
          return;
        }
        const nextSession: AuthSession = {
          ...session,
          user,
        };
        setSession(nextSession);
        saveSession(nextSession);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        clearCurrentSession();
        setAuthErrorMessage(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [session?.token, clearCurrentSession]);

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

  const handleLogin = async (input: LoginInput) => {
    setIsLoggingIn(true);
    setAuthErrorMessage(null);
    try {
      const authSession = await login(input);
      saveSession(authSession);
      setSession(authSession);
    } catch (error) {
      setAuthErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearCurrentSession();
    setAuthErrorMessage(null);
  };

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
    setBookingErrorMessage(null);

    try {
      await cancelBooking(bookingId);
      setBookingSuccessMessage("Reserva cancelada com sucesso.");
      await loadBookingsData(false);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setBookingErrorMessage(getErrorMessage(error));
      }
    } finally {
      setIsCancelingBookingId(null);
    }
  };

  if (!session) {
    return (
      <main className="container container--narrow">
        <h1>Portal de Aluguel de Carros</h1>
        <section className="panel">
          <h2>Login</h2>
          <LoginForm
            isSubmitting={isLoggingIn}
            errorMessage={authErrorMessage}
            onLogin={handleLogin}
          />
          <p className="info-message">
            Mock de acesso: cliente1@email.com ou cliente2@email.com (senha: 123456).
          </p>
        </section>
      </main>
    );
  }

  if (isCheckingSession) {
    return (
      <main className="container container--narrow">
        <h1>Portal de Aluguel de Carros</h1>
        <p className="info-message">Validando sessão...</p>
      </main>
    );
  }

  const bookingsTitle =
    session.user.role === "STAFF" ? "Reservas do sistema" : "Minhas reservas";

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <h1>Portal de Aluguel de Carros</h1>
          <p className="muted-text">
            {session.user.email} ({session.user.role})
          </p>
        </div>
        <button type="button" className="secondary-button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <section className="panel">
        <h2>Lista de veículos</h2>
        <VehicleList
          vehicles={vehicles}
          isLoading={isLoadingVehicles}
          errorMessage={vehicleErrorMessage}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={(vehicleId) => setSelectedVehicleId(vehicleId)}
        />
      </section>

      <section className="panel">
        <h2>Novo agendamento</h2>
        <BookingForm
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          isSubmitting={isCreatingBooking}
          isBookingAllowed={isBookingAllowed}
          errorMessage={bookingFormErrorMessage}
          successMessage={bookingSuccessMessage}
          onSelectVehicle={(vehicleId) => setSelectedVehicleId(vehicleId)}
          onCreateBooking={handleCreateBooking}
        />
      </section>

      <section className="panel">
        <h2>{bookingsTitle}</h2>
        <BookingList
          bookings={bookings}
          vehicles={vehicles}
          isLoading={isLoadingBookings}
          errorMessage={bookingErrorMessage}
          cancelingBookingId={isCancelingBookingId}
          canCancel={session.user.role === "CLIENT"}
          onCancelBooking={handleCancelBooking}
        />
      </section>
    </main>
  );
}
