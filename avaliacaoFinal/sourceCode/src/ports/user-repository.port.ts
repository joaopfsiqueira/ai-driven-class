import { User } from "../models";

export interface IUserRepository {
  findByEmail(email: string): User | null;
  findById(id: number): User | null;
  findAll(): User[];
}
