import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  // This array is our in-memory database
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);
    return user || null;
  }

  async findByUsername(username: string) {
    const user = this.items.find((item) => item.username === username);
    return user || null;
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      username: data.username,
      email: data.email,
      password: data.password || null,
      googleId: data.googleId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(user);
    return user;
  }
}
