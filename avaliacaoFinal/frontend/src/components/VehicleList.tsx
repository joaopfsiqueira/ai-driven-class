import { Vehicle } from "../types/Vehicle";
import { VehicleItem } from "./VehicleItem";

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  errorMessage: string | null;
  selectedVehicleId: number | null;
  onSelectVehicle: (vehicleId: number) => void;
}

export function VehicleList({
  vehicles,
  isLoading,
  errorMessage,
  selectedVehicleId,
  onSelectVehicle,
}: VehicleListProps) {
  if (isLoading) {
    return <p className="info-message">Carregando veículos...</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  if (vehicles.length === 0) {
    return <p className="info-message">Nenhum veículo encontrado.</p>;
  }

  return (
    <div className="vehicle-list">
      {vehicles.map((vehicle) => (
        <VehicleItem
          key={vehicle.id}
          vehicle={vehicle}
          isSelected={selectedVehicleId === vehicle.id}
          onSelectForBooking={onSelectVehicle}
        />
      ))}
    </div>
  );
}
