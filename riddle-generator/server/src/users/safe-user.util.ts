import type { User } from '@prisma/client';

export type SafeUser = Omit<User, 'password'>;

export function sanitizeUser(user: User): SafeUser {
  const { password: _password, ...rest } = user;
  return rest;
}

export function sanitizeUsers(users: User[]): SafeUser[] {
  return users.map(sanitizeUser);
}
