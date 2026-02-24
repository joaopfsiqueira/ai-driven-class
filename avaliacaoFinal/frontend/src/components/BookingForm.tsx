import { FormEvent, useMemo, useState } from "react";
import { CreateBookingInput } from "../types/Booking";
import { Vehicle } from "../types/Vehicle";

interface BookingFormProps {
  vehicles: Vehicle[];
  selectedVehicleId: number | null;
  isSubmitting: boolean;
  isBookingAllowed: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onSelectVehicle: (vehicleId: number) => void;
  onCreateBooking: (input: CreateBookingInput) => Promise<boolean>;
}

export function BookingForm({
  vehicles,
  selectedVehicleId,
  isSubmitting,
  isBookingAllowed,
  errorMessage,
  successMessage,
  onSelectVehicle,
  onCreateBooking,
}: BookingFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const activeVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.status === "ACTIVE"),
    [vehicles]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!isBookingAllowed) {
      setValidationError("Somente usuários CLIENT podem criar agendamentos.");
      return;
    }
    if (!selectedVehicleId) {
      setValidationError("Selecione um veículo ativo.");
      return;
    }
    if (!startDate || !endDate) {
      setValidationError("Informe a data inicial e final.");
      return;
    }
    if (startDate > endDate) {
      setValidationError("A data inicial deve ser menor ou igual à data final.");
      return;
    }

    const success = await onCreateBooking({
      vehicleId: selectedVehicleId,
      startDate,
      endDate,
      notes,
    });

    if (success) {
      setStartDate("");
      setEndDate("");
      setNotes("");
    }
  };

  return (
    <form className="vehicle-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="form-grid">
        <label>
          Veículo
          <select
            value={selectedVehicleId ?? ""}
            onChange={(event) => onSelectVehicle(Number(event.target.value))}
            disabled={!isBookingAllowed || activeVehicles.length === 0}
          >
            <option value="" disabled>
              Selecione
            </option>
            {activeVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.plate}
              </option>
            ))}
          </select>
        </label>

        <label>
          Início
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
          />
        </label>

        <label>
          Fim
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            required
          />
        </label>

        <label className="span-2">
          Observações (opcional)
          <input
            type="text"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ex.: retirada no período da manhã"
          />
        </label>
      </div>

      {!isBookingAllowed ? (
        <p className="info-message">
          Seu usuário não possui perfil de cliente para criar reservas.
        </p>
      ) : null}
      {validationError ? <p className="error-message">{validationError}</p> : null}
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
      {successMessage ? <p className="success-message">{successMessage}</p> : null}

      <button
        type="submit"
        disabled={!isBookingAllowed || isSubmitting || activeVehicles.length === 0}
      >
        {isSubmitting ? "Agendando..." : "Criar agendamento"}
      </button>
    </form>
  );
}
