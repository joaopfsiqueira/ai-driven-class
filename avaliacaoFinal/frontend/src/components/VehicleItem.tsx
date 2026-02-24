import { Vehicle } from "../types/Vehicle";

interface VehicleItemProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelectForBooking: (vehicleId: number) => void;
}

export function VehicleItem({
  vehicle,
  isSelected,
  onSelectForBooking,
}: VehicleItemProps) {
  const isUnavailable = vehicle.status !== "ACTIVE";

  return (
    <article className="vehicle-card">
      <div className="vehicle-card__header">
        <h3>{vehicle.brand} {vehicle.model}</h3>
        <span className={`status-pill status-pill--${vehicle.status.toLowerCase()}`}>
          {vehicle.status}
        </span>
      </div>

      <p><strong>Ano:</strong> {vehicle.year}</p>
      <p><strong>Categoria:</strong> {vehicle.category}</p>
      <p><strong>Placa:</strong> {vehicle.plate}</p>
      <p><strong>Diária:</strong> R$ {vehicle.dailyRate.toFixed(2)}</p>

      <button
        type="button"
        onClick={() => onSelectForBooking(vehicle.id)}
        disabled={isUnavailable}
      >
        {isUnavailable
          ? "Indisponível para reserva"
          : isSelected
            ? "Selecionado para agendamento"
            : "Agendar este veículo"}
      </button>
    </article>
  );
}
