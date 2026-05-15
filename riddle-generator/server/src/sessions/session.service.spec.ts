import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

const mockPrisma = {
  session: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('jwt-token'),
  decode: jest.fn().mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600, userId: 'u1' }),
  verify: jest.fn(),
};

const fakeUser = { id: 'u1', email: 'a@b.com' } as any;

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.SECRET = 'test-secret';
    process.env.EXPIRES_AT = '1h';
    process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
    process.env.REFRESH_TOKEN_BEFORE_EXPIRES = '5m';
    process.env.CLEAN_SESSION_TOKEN_AFTER = '30d';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  describe('createForUser', () => {
    it('creates and returns a session', async () => {
      const session = { id: 's1', token: 'jwt-token', refresh_token: 'ref' };
      mockPrisma.session.create.mockResolvedValue(session);

      const result = await service.createForUser(fakeUser);
      expect(result).toEqual(session);
      expect(mockPrisma.session.create).toHaveBeenCalled();
    });
  });

  describe('validateToken', () => {
    it('returns null when JWT verification throws', async () => {
      mockJwt.verify.mockImplementation(() => { throw new Error('invalid'); });
      const result = await service.validateToken('bad-token');
      expect(result).toBeNull();
    });

    it('returns null when session not found in DB', async () => {
      mockJwt.verify.mockReturnValue({ userId: 'u1' });
      mockPrisma.session.findUnique.mockResolvedValue(null);
      const result = await service.validateToken('token');
      expect(result).toBeNull();
    });

    it('returns null when session is expired', async () => {
      mockJwt.verify.mockReturnValue({ userId: 'u1' });
      mockPrisma.session.findUnique.mockResolvedValue({
        expires_at: new Date(Date.now() - 1000),
        user: fakeUser,
      });
      const result = await service.validateToken('token');
      expect(result).toBeNull();
    });

    it('returns user when session is valid and not expiring soon', async () => {
      mockJwt.verify.mockReturnValue({ userId: 'u1' });
      mockPrisma.session.findUnique.mockResolvedValue({
        id: 's1',
        expires_at: new Date(Date.now() + 60 * 60 * 1000),
        user: fakeUser,
        userId: 'u1',
        token: 'tok',
        refresh_token: 'ref',
      });

      const result = await service.validateToken('token');
      expect(result).toEqual({ user: fakeUser });
    });
  });

  describe('removeByToken', () => {
    it('deletes sessions matching the token', async () => {
      mockPrisma.session.deleteMany.mockResolvedValue({ count: 1 });
      await service.removeByToken('some-token');
      expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({ where: { token: 'some-token' } });
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('deletes sessions older than the configured max age', async () => {
      mockPrisma.session.deleteMany.mockResolvedValue({ count: 5 });
      await service.cleanupExpiredSessions();
      expect(mockPrisma.session.deleteMany).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes a session by id', async () => {
      mockPrisma.session.delete.mockResolvedValue({});
      await service.remove('s1');
      expect(mockPrisma.session.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
    });

    it('throws when session not found (P2025)', async () => {
      mockPrisma.session.delete.mockRejectedValue({ code: 'P2025' });
      await expect(service.remove('missing')).rejects.toThrow('Session not found');
    });
  });

  describe('findAll', () => {
    it('returns all sessions with users', async () => {
      mockPrisma.session.findMany.mockResolvedValue([{ id: 's1', user: fakeUser }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('refreshSession', () => {
    it('updates the session with a new token and returns session+user', async () => {
      const session = {
        id: 's1',
        userId: 'u1',
        user: fakeUser,
        token: 'old-token',
        refresh_token: 'old-ref',
        expires_at: new Date(Date.now() + 3600_000),
      } as any;

      const updated = { ...session, token: 'jwt-token' };
      mockPrisma.session.update.mockResolvedValue(updated);

      const result = await service.refreshSession(session);
      expect(result.token).toBe('jwt-token');
      expect(mockPrisma.session.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 's1' } }),
      );
    });
  });

  describe('validateToken — near-expiry refresh', () => {
    it('refreshes the session when it is close to expiring', async () => {
      mockJwt.verify.mockReturnValue({ userId: 'u1' });
      const soon = new Date(Date.now() + 60_000); // expires in 1 minute
      const session = {
        id: 's1',
        userId: 'u1',
        expires_at: soon,
        user: fakeUser,
        token: 'old-token',
        refresh_token: 'old-ref',
      };
      mockPrisma.session.findUnique.mockResolvedValue(session);

      const refreshed = { ...session, token: 'jwt-token', user: fakeUser };
      mockPrisma.session.update.mockResolvedValue(refreshed);

      const result = await service.validateToken('old-token');
      expect(result).toMatchObject({ user: fakeUser, newToken: 'jwt-token' });
    });
  });

  describe('refreshByRefreshToken', () => {
    it('returns null when refresh token JWT verification fails', async () => {
      mockJwt.verify.mockImplementation(() => { throw new Error('expired'); });
      const result = await service.refreshByRefreshToken('bad-refresh');
      expect(result).toBeNull();
    });

    it('returns null when session not found by refresh token', async () => {
      mockJwt.verify.mockReturnValue({ userId: 'u1', email: 'a@b.com' });
      mockPrisma.session.findUnique.mockResolvedValue(null);
      const result = await service.refreshByRefreshToken('valid-but-unknown');
      expect(result).toBeNull();
    });

    it('returns null when session userId does not match token userId', async () => {
      mockJwt.verify.mockReturnValue({ userId: 'u1', email: 'a@b.com' });
      mockPrisma.session.findUnique.mockResolvedValue({
        id: 's1',
        userId: 'different-user',
        user: fakeUser,
        token: 'tok',
        refresh_token: 'ref',
        expires_at: new Date(Date.now() + 3600_000),
      });
      const result = await service.refreshByRefreshToken('ref');
      expect(result).toBeNull();
    });

    it('refreshes and returns the session when token is valid', async () => {
      mockJwt.verify.mockReturnValue({ userId: 'u1', email: 'a@b.com' });
      const session = {
        id: 's1',
        userId: 'u1',
        user: fakeUser,
        token: 'old',
        refresh_token: 'ref',
        expires_at: new Date(Date.now() + 3600_000),
      };
      mockPrisma.session.findUnique.mockResolvedValue(session);
      mockPrisma.session.update.mockResolvedValue({ ...session, token: 'jwt-token', user: fakeUser });

      const result = await service.refreshByRefreshToken('ref');
      expect(result?.token).toBe('jwt-token');
    });
  });

  describe('remove — non-P2025 rethrow', () => {
    it('rethrows non-P2025 errors from session.delete', async () => {
      const err = new Error('DB crash');
      mockPrisma.session.delete.mockRejectedValue(err);
      await expect(service.remove('s1')).rejects.toThrow('DB crash');
    });
  });
});
