import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import 'dotenv/config';
import type { Request, Response } from 'express';
import { Public } from '../../utils/decorators/public.decorator';
import { setAuthCookies } from '../../utils/setAuthCookies';
import { AuthService } from './auth.service';
import { SessionService } from '../../sessions/session.service';
import { LoginDto } from './dto/Login.dto';
import { RegisterDto } from './dto/Register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(registerDto);
    setAuthCookies(res, { accessToken: result.token, refreshToken: result.refreshToken });
    return {
      message: 'User registered successfully',
      user: result.user,
      expiresAt: result.expiresAt,
    };
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout and clear auth cookies' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req.cookies as Record<string, string>)?.access_token;
    if (token) {
      await this.sessionService.removeByToken(token).catch(() => {});
    }
    res.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.clearCookie('refresh_token', { httpOnly: true, secure: true, sameSite: 'none' });
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user and get access token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    setAuthCookies(res, {
      accessToken: result.token,
      refreshToken: result.refreshToken
    });

    return {
      message: 'Login successful',
      user: result.user,
      expiresAt: result.expiresAt,
    };
  }
}
