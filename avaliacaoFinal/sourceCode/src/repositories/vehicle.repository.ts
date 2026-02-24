import { Vehicle } from "../models";
import { vehiclesMock } from "../mocks/vehicles.mock";

export class VehicleRepository {
  private data: Vehicle[];

  constructor() {
    this.data = vehiclesMock.map((v) => ({ ...v }));
  }

  findById(id: number): Vehicle | null {
    return this.data.find((v) => v.id === id) ?? null;
  }

  findAll(): Vehicle[] {
    return this.data.map((v) => ({ ...v }));
  }
}
