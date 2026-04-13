import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SessionService } from '../../sessions/session.service';
import { UserService } from '../user.service';
import { RegisterDto } from './dto/Register.dto';
import { CreateUserDto } from '../dto/CreateUserDto';
import { LoginDto } from './dto/Login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const createUserDto: CreateUserDto = {
      email,
      password: hashedPassword,
      name,
    };

    const user = await this.userService.createUserOnly(createUserDto);

    const session = await this.sessionService.createForUser(user);

    return {
      message: 'User registered successfully',
      user,
      token: session.token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (user.is_guest || !user.password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const session = await this.sessionService.createForUser(user);

    return {
      message: 'Login successful',
      user,
      token: session.token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
    };
  }

  async createAnonymousUser() {
    const tempId = uuidv4();

    const createGuestDto: CreateUserDto = {
      email: `guest_${tempId}@internal.app`,
      name: 'Гість',
      is_guest: true,
      password: null,
      onboarding_completed: false,
    };

    const user = await this.userService.createUserOnly(createGuestDto);

    const session = await this.sessionService.createForUser(user);

    return {
      user,
      token: session.token,
      refreshToken: session.refresh_token,
    };
  }
}
