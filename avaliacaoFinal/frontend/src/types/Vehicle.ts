export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  dailyRate: number;
  status: string;
}

export interface CreateVehicleInput {
  brand: string;
  model: string;
  plate: string;
  dailyRate: number;
  status: string;
}
