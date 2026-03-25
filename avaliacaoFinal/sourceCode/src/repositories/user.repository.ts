import { User } from "../models";
import { usersMock } from "../mocks/users.mock";
import { IUserRepository } from "../ports/user-repository.port";

export class UserRepository implements IUserRepository {
  private data: User[];

  constructor() {
    this.data = usersMock.map((u) => ({ ...u }));
  }

  findByEmail(email: string): User | null {
    return this.data.find((u) => u.email === email) ?? null;
  }

  findById(id: number): User | null {
    return this.data.find((u) => u.id === id) ?? null;
  }

  findAll(): User[] {
    return this.data.map((u) => ({ ...u }));
  }
}
