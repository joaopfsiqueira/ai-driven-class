export type VehicleStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  plate: string;
  year: number;
  category: string;
  dailyRate: number;
  status: VehicleStatus;
}
