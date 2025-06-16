import * as bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => bcrypt.compare(password, hash);
