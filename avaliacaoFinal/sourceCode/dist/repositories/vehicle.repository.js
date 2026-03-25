"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRepository = void 0;
const vehicles_mock_1 = require("../mocks/vehicles.mock");
class VehicleRepository {
    data;
    constructor() {
        this.data = vehicles_mock_1.vehiclesMock.map((v) => ({ ...v }));
    }
    findById(id) {
        return this.data.find((v) => v.id === id) ?? null;
    }
    findAll() {
        return this.data.map((v) => ({ ...v }));
    }
}
exports.VehicleRepository = VehicleRepository;
//# sourceMappingURL=vehicle.repository.js.map