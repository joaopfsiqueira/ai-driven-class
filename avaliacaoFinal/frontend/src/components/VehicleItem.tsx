import { Vehicle } from "../types/Vehicle";

interface VehicleItemProps {
  vehicle: Vehicle;
  isDeleting: boolean;
  onDelete: (vehicleId: string) => void;
}

export function VehicleItem({ vehicle, isDeleting, onDelete }: VehicleItemProps) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-card__header">
        <h3>{vehicle.brand} {vehicle.model}</h3>
        <span className={`status-pill status-pill--${vehicle.status.toLowerCase()}`}>
          {vehicle.status}
        </span>
      </div>
      <p><strong>Placa:</strong> {vehicle.plate}</p>
      <p><strong>Diária:</strong> R$ {vehicle.dailyRate.toFixed(2)}</p>
      <button
        type="button"
        className="danger-button"
        onClick={() => onDelete(vehicle.id)}
        disabled={isDeleting}
      >
        {isDeleting ? "Removendo..." : "Deletar"}
      </button>
    </article>
  );
}
