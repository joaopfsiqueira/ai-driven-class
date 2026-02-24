import { VehicleList } from "../components/VehicleList";
import { Vehicle } from "../types/Vehicle";

interface VehiclesPageProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  errorMessage: string | null;
  selectedVehicleId: number | null;
  onSelectVehicle: (vehicleId: number) => void;
}

export function VehiclesPage({
  vehicles,
  isLoading,
  errorMessage,
  selectedVehicleId,
  onSelectVehicle,
}: VehiclesPageProps) {
  return (
    <section className="panel page-content">
      <h2>Lista de veiculos</h2>
      <VehicleList
        vehicles={vehicles}
        isLoading={isLoading}
        errorMessage={errorMessage}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={onSelectVehicle}
      />
    </section>
  );
}
