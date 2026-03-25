import { Vehicle } from "../models";

export interface IVehicleRepository {
  findById(id: number): Vehicle | null;
  findAll(): Vehicle[];
}
