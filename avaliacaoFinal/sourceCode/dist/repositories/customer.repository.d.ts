import { Customer } from "../models";
import { ICustomerRepository } from "../ports/customer-repository.port";
export declare class CustomerRepository implements ICustomerRepository {
    private data;
    constructor();
    findById(id: number): Customer | null;
    findByUserId(userId: number): Customer | null;
    findAll(): Customer[];
}
//# sourceMappingURL=customer.repository.d.ts.map