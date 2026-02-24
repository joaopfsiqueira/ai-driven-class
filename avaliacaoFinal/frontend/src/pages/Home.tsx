import { useCallback, useEffect, useState } from "react";
import {
  createVehicle,
  deleteVehicle,
  getErrorMessage,
  listVehicles,
} from "../api/api";
import { VehicleForm } from "../components/VehicleForm";
import { VehicleList } from "../components/VehicleList";
import { CreateVehicleInput, Vehicle } from "../types/Vehicle";

export function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
  const [listErrorMessage, setListErrorMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const loadVehicles = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setListErrorMessage(null);
    try {
      const vehicleList = await listVehicles();
      setVehicles(vehicleList);
    } catch (error) {
      setListErrorMessage(getErrorMessage(error));
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadVehicles(true);
  }, [loadVehicles]);

  const handleCreateVehicle = async (input: CreateVehicleInput): Promise<boolean> => {
    setIsCreating(true);
    setFormErrorMessage(null);
    try {
      await createVehicle(input);
      await loadVehicles(false);
      return true;
    } catch (error) {
      setFormErrorMessage(getErrorMessage(error));
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    const shouldDelete = window.confirm("Tem certeza que deseja deletar este veículo?");
    if (!shouldDelete) {
      return;
    }

    setDeletingVehicleId(vehicleId);
    setListErrorMessage(null);
    try {
      await deleteVehicle(vehicleId);
      await loadVehicles(false);
    } catch (error) {
      setListErrorMessage(getErrorMessage(error));
    } finally {
      setDeletingVehicleId(null);
    }
  };

  return (
    <main className="container">
      <h1>Portal de Aluguel de Carros - Admin</h1>

      <section className="panel">
        <h2>Criar novo veículo</h2>
        <VehicleForm
          isSubmitting={isCreating}
          errorMessage={formErrorMessage}
          onCreate={handleCreateVehicle}
        />
      </section>

      <section className="panel">
        <h2>Lista de veículos</h2>
        <VehicleList
          vehicles={vehicles}
          isLoading={isLoading}
          errorMessage={listErrorMessage}
          deletingVehicleId={deletingVehicleId}
          onDelete={handleDeleteVehicle}
        />
      </section>
    </main>
  );
}
