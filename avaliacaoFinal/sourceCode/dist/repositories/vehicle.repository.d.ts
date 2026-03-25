import { Vehicle } from "../models";
import { IVehicleRepository } from "../ports/vehicle-repository.port";
export declare class VehicleRepository implements IVehicleRepository {
    private data;
    constructor();
    findById(id: number): Vehicle | null;
    findAll(): Vehicle[];
}
//# sourceMappingURL=vehicle.repository.d.ts.map