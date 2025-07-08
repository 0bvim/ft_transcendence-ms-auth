import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";
import { UserNotFoundError } from "../../use-cases/errors/user-not-found-error";
import { UserAlreadyDeletedError } from "../../use-cases/errors/user-already-deleted-error";

export class InMemoryUsersRepository implements UsersRepository {
  // This array is our in-memory database
  public items: User[] = [];

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);
    return user || null;
  }

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

  async softDelete(id: string) {
    const userIndex = this.items.findIndex((item) => item.id === id);
    
    if (userIndex === -1) {
      throw new UserNotFoundError();
    }

    const user = this.items[userIndex];
    
    if (user.deletedAt) {
      throw new UserAlreadyDeletedError();
    }

    this.items[userIndex] = {
      ...user,
      deletedAt: new Date(),
      updatedAt: new Date(),
    };

    return this.items[userIndex];
  }
}
