import { Response } from 'express';
import { safeMs } from './safeMs';

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken?: string | null },
): void {
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: safeMs(process.env.EXPIRES_AT ?? '4h'),
  });

  if (tokens.refreshToken) {
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: safeMs(process.env.REFRESH_TOKEN_BEFORE_EXPIRES ?? '1h'),
    });
  }
}
