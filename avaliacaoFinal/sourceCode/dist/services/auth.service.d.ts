import { User, UserRole } from "../models";
import { IUserRepository } from "../ports/user-repository.port";
import { ICustomerRepository } from "../ports/customer-repository.port";
import { AuthPayload } from "../types/auth-payload";
export type { AuthPayload };
export interface LoginDto {
    email: string;
    password: string;
}
export interface LoginResult {
    token: string;
    user: {
        id: number;
        email: string;
        role: UserRole;
        customerId?: number;
    };
}
export declare class AuthService {
    private readonly userRepository;
    private readonly customerRepository;
    constructor(userRepository: IUserRepository, customerRepository: ICustomerRepository);
    login(dto: LoginDto): LoginResult;
    me(userId: number): User | null;
}
//# sourceMappingURL=auth.service.d.ts.map