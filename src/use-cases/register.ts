import { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { UsersRepository } from "../repositories/users-repository";

interface RegisterUseCaseRequest {
  username: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  // Use dependency injection to pass the repository
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    username,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // Hash the password. 6 is the salt rounds
    // TODO: store the salt rounds in an environment variable
    const password_hash = await hash(password, 6);

    // Create the user in the databasa
    const user = await this.usersRepository.create({
      username,
      email,
      password: password_hash,
    });

    return {
      user,
    };
  }
}
