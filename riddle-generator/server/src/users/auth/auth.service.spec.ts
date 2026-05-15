import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { SessionService } from '../../sessions/session.service';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUserService = {
  findByEmail: jest.fn(),
  createUserOnly: jest.fn(),
};

const mockSessionService = {
  createForUser: jest.fn(),
};

const fakeSession = {
  token: 'tok',
  refresh_token: 'ref',
  expires_at: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: SessionService, useValue: mockSessionService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('registers a new user and returns token', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.createUserOnly.mockResolvedValue({ id: 'u1', email: 'a@b.com' });
      mockSessionService.createForUser.mockResolvedValue(fakeSession);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const result = await service.register({ email: 'a@b.com', password: 'pass', name: 'Alice' });
      expect(result.token).toBe('tok');
      expect(result.user.id).toBe('u1');
    });

    it('throws HttpException CONFLICT when email already in use', async () => {
      mockUserService.findByEmail.mockResolvedValue({ id: 'existing' });

      await expect(service.register({ email: 'a@b.com', password: 'pass', name: 'Alice' })).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('login', () => {
    it('returns token on valid credentials', async () => {
      mockUserService.findByEmail.mockResolvedValue({
        id: 'u1',
        is_guest: false,
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockSessionService.createForUser.mockResolvedValue(fakeSession);

      const result = await service.login({ email: 'a@b.com', password: 'pass' });
      expect(result.token).toBe('tok');
    });

    it('throws 401 when user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'a@b.com', password: 'x' })).rejects.toThrow(HttpException);
    });

    it('throws 401 when user is a guest', async () => {
      mockUserService.findByEmail.mockResolvedValue({ id: 'u1', is_guest: true, password: null });
      await expect(service.login({ email: 'g@b.com', password: 'x' })).rejects.toThrow(HttpException);
    });

    it('throws 401 when password is wrong', async () => {
      mockUserService.findByEmail.mockResolvedValue({ id: 'u1', is_guest: false, password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow(HttpException);
    });
  });

  describe('createAnonymousUser', () => {
    it('creates a guest user and returns token', async () => {
      mockUserService.createUserOnly.mockResolvedValue({ id: 'guest-1' });
      mockSessionService.createForUser.mockResolvedValue(fakeSession);

      const result = await service.createAnonymousUser();
      expect(result.token).toBe('tok');
      expect(mockUserService.createUserOnly).toHaveBeenCalledWith(
        expect.objectContaining({ is_guest: true }),
      );
    });
  });
});
