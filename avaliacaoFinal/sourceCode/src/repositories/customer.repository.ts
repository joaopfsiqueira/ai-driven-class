import { Customer } from "../models";
import { customersMock } from "../mocks/customers.mock";
import { ICustomerRepository } from "../ports/customer-repository.port";

export class CustomerRepository implements ICustomerRepository {
  private data: Customer[];

  constructor() {
    this.data = customersMock.map((c) => ({ ...c }));
  }

  findById(id: number): Customer | null {
    return this.data.find((c) => c.id === id) ?? null;
  }

  findByUserId(userId: number): Customer | null {
    return this.data.find((c) => c.user_id === userId) ?? null;
  }

  findAll(): Customer[] {
    return this.data.map((c) => ({ ...c }));
  }
}
