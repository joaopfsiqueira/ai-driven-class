import { LoginForm } from "../components/LoginForm";
import { AppMenu } from "../components/AppMenu";
import { LoginInput } from "../types/Auth";
import { BookingsPage } from "./BookingsPage";
import { NewBookingPage } from "./NewBookingPage";
import { VehiclesPage } from "./VehiclesPage";
import { useAuthSession } from "../hooks/useAuthSession";
import { useFleetCatalog } from "../hooks/useFleetCatalog";
import { useBookingMutations } from "../hooks/useBookingMutations";

export function Home() {
  const {
    session,
    isCheckingSession,
    authErrorMessage,
    isLoggingIn,
    handleLogin: performLogin,
    handleLogout,
    handleUnauthorized,
  } = useAuthSession();

  const fleet = useFleetCatalog(session, handleUnauthorized);

  const {
    isCreatingBooking,
    isCancelingBookingId,
    bookingFormErrorMessage,
    bookingSuccessMessage,
    handleCreateBooking,
    handleCancelBooking,
  } = useBookingMutations({
    loadBookingsData: fleet.loadBookingsData,
    handleUnauthorized,
    onBookingListError: fleet.setBookingErrorMessage,
  });

  const handleLogin = async (input: LoginInput) => {
    await performLogin(input);
    fleet.setCurrentPage("vehicles");
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

  const renderCurrentPage = () => {
    if (fleet.currentPage === "vehicles") {
      return (
        <VehiclesPage
          vehicles={fleet.vehicles}
          isLoading={fleet.isLoadingVehicles}
          errorMessage={fleet.vehicleErrorMessage}
          selectedVehicleId={fleet.selectedVehicleId}
          onSelectVehicle={(vehicleId) => fleet.setSelectedVehicleId(vehicleId)}
        />
      );
    }

    if (fleet.currentPage === "new-booking") {
      return (
        <NewBookingPage
          vehicles={fleet.vehicles}
          selectedVehicleId={fleet.selectedVehicleId}
          isSubmitting={isCreatingBooking}
          isBookingAllowed={fleet.isBookingAllowed}
          errorMessage={bookingFormErrorMessage}
          successMessage={bookingSuccessMessage}
          onSelectVehicle={(vehicleId) => fleet.setSelectedVehicleId(vehicleId)}
          onCreateBooking={handleCreateBooking}
        />
      );
    }

    return (
      <BookingsPage
        title={bookingsTitle}
        bookings={fleet.bookings}
        vehicles={fleet.vehicles}
        isLoading={fleet.isLoadingBookings}
        errorMessage={fleet.bookingErrorMessage}
        cancelingBookingId={isCancelingBookingId}
        canCancel={session.user.role === "CLIENT"}
        onCancelBooking={handleCancelBooking}
      />
    );
  };

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

      <AppMenu
        currentPage={fleet.currentPage}
        bookingsLabel={bookingsTitle}
        canCreateBooking={fleet.isBookingAllowed}
        onNavigate={fleet.setCurrentPage}
      />

      {renderCurrentPage()}
    </main>
  );
}
