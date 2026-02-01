import { User } from '@prisma/client';

export interface ValidateTokenResult {
  user: User;
  newToken?: string;
}
