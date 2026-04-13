import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import 'dotenv/config';
import type { Response } from 'express';
import { Public } from '../../utils/decorators/public.decorator';
import { setAuthCookies } from '../../utils/setAuthCookies';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { RegisterDto } from './dto/Register.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
