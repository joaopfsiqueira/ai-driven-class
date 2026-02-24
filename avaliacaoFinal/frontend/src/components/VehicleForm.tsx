import { FormEvent, useState } from "react";
import { CreateVehicleInput } from "../types/Vehicle";

interface VehicleFormProps {
  isSubmitting: boolean;
  errorMessage: string | null;
  onCreate: (input: CreateVehicleInput) => Promise<boolean>;
}

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "MAINTENANCE"] as const;

export function VehicleForm({
  isSubmitting,
  errorMessage,
  onCreate,
}: VehicleFormProps) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [status, setStatus] = useState<string>("ACTIVE");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!brand.trim() || !model.trim() || !plate.trim() || !dailyRate.trim()) {
      setValidationError("Preencha todos os campos obrigatórios.");
      return;
    }

    const parsedDailyRate = Number(dailyRate);
    if (!Number.isFinite(parsedDailyRate) || parsedDailyRate <= 0) {
      setValidationError("A diária deve ser um número maior que zero.");
      return;
    }

    const success = await onCreate({
      brand: brand.trim(),
      model: model.trim(),
      plate: plate.trim().toUpperCase(),
      dailyRate: parsedDailyRate,
      status,
    });

    if (success) {
      setBrand("");
      setModel("");
      setPlate("");
      setDailyRate("");
      setStatus("ACTIVE");
    }
  };

  return (
    <form className="vehicle-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="form-grid">
        <label>
          Marca
          <input
            type="text"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            required
          />
        </label>

        <label>
          Modelo
          <input
            type="text"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            required
          />
        </label>

        <label>
          Placa
          <input
            type="text"
            value={plate}
            onChange={(event) => setPlate(event.target.value)}
            required
          />
        </label>

        <label>
          Diária (R$)
          <input
            type="number"
            min="0"
            step="0.01"
            value={dailyRate}
            onChange={(event) => setDailyRate(event.target.value)}
            required
          />
        </label>

        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {validationError ? <p className="error-message">{validationError}</p> : null}
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Criar veículo"}
      </button>
    </form>
  );
}
