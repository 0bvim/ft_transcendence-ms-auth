import { User } from "@prisma/client";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CreateUserData {
  email: string;
  name: string;
  nickname?: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface UpdateUserData {
  name?: string;
  nickname?: string;
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface UserWithoutPassword extends Omit<User, "password"> {}

export interface UpdateProfileRequest {
  name?: string;
  nickname?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
