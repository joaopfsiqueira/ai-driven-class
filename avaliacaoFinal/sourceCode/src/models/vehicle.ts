export type VehicleStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  daily_rate: number;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}
