import { AppPageId } from "../types/AppPage";

interface AppMenuProps {
  currentPage: AppPageId;
  bookingsLabel: string;
  canCreateBooking: boolean;
  onNavigate: (page: AppPageId) => void;
}

export function AppMenu({
  currentPage,
  bookingsLabel,
  canCreateBooking,
  onNavigate,
}: AppMenuProps) {
  return (
    <nav className="app-menu" aria-label="Menu principal">
      <button
        type="button"
        className={`menu-button ${currentPage === "vehicles" ? "menu-button--active" : ""}`}
        onClick={() => onNavigate("vehicles")}
      >
        Veiculos
      </button>

      <button
        type="button"
        className={`menu-button ${currentPage === "new-booking" ? "menu-button--active" : ""}`}
        onClick={() => onNavigate("new-booking")}
        disabled={!canCreateBooking}
      >
        Novo agendamento
      </button>

      <button
        type="button"
        className={`menu-button ${currentPage === "bookings" ? "menu-button--active" : ""}`}
        onClick={() => onNavigate("bookings")}
      >
        {bookingsLabel}
      </button>
    </nav>
  );
}
