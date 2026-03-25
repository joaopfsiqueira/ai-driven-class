import { User } from "../models";
import { IUserRepository } from "../ports/user-repository.port";
export declare class UserRepository implements IUserRepository {
    private data;
    constructor();
    findByEmail(email: string): User | null;
    findById(id: number): User | null;
    findAll(): User[];
}
//# sourceMappingURL=user.repository.d.ts.map