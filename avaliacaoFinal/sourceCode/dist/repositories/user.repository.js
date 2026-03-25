"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const users_mock_1 = require("../mocks/users.mock");
class UserRepository {
    data;
    constructor() {
        this.data = users_mock_1.usersMock.map((u) => ({ ...u }));
    }
    findByEmail(email) {
        return this.data.find((u) => u.email === email) ?? null;
    }
    findById(id) {
        return this.data.find((u) => u.id === id) ?? null;
    }
    findAll() {
        return this.data.map((u) => ({ ...u }));
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map