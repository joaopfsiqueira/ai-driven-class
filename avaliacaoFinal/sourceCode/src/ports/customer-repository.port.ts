import { Customer } from "../models";

export interface ICustomerRepository {
  findById(id: number): Customer | null;
  findByUserId(userId: number): Customer | null;
  findAll(): Customer[];
}
