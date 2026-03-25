"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const customers_mock_1 = require("../mocks/customers.mock");
class CustomerRepository {
    data;
    constructor() {
        this.data = customers_mock_1.customersMock.map((c) => ({ ...c }));
    }
    findById(id) {
        return this.data.find((c) => c.id === id) ?? null;
    }
    findByUserId(userId) {
        return this.data.find((c) => c.user_id === userId) ?? null;
    }
    findAll() {
        return this.data.map((c) => ({ ...c }));
    }
}
exports.CustomerRepository = CustomerRepository;
//# sourceMappingURL=customer.repository.js.map