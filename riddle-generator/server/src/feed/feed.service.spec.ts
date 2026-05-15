import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { PrismaService } from '../prisma/prisma.service';

const makeRiddle = (overrides: any = {}) => ({
  id: 'r1',
  content: 'Riddle?',
  answer: 'Answer',
  is_public: true,
  created_at: new Date(),
  complexity: 2,
  type: 'DANETKI',
  likes_count: 3,
  comments_count: 1,
  author: { id: 'a1', name: 'Author', level: 1, avatar_url: null },
  RiddleAttempt: [],
  likes: [],
  saved_by: [],
  ...overrides,
});

const mockPrisma = {
  riddles: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  savedRiddles: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  follow: {
    findMany: jest.fn(),
  },
};

describe('FeedService', () => {
  let service: FeedService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
  });

  describe('getPublicFeed', () => {
    it('returns paginated public riddles', async () => {
      mockPrisma.riddles.findMany.mockResolvedValue([makeRiddle()]);
      mockPrisma.riddles.count.mockResolvedValue(1);

      const result = await service.getPublicFeed(undefined, 1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('filters by authorId when provided', async () => {
      mockPrisma.riddles.findMany.mockResolvedValue([makeRiddle()]);
      mockPrisma.riddles.count.mockResolvedValue(1);

      await service.getPublicFeed('viewer-1', 1, 10, 'author-1');

      expect(mockPrisma.riddles.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ author_id: 'author-1' }),
        }),
      );
    });

    it('does not include author_id filter when authorId is undefined', async () => {
      mockPrisma.riddles.findMany.mockResolvedValue([]);
      mockPrisma.riddles.count.mockResolvedValue(0);

      await service.getPublicFeed(undefined, 1, 10);

      const call = mockPrisma.riddles.findMany.mock.calls[0][0];
      expect(call.where).not.toHaveProperty('author_id');
    });

    it('marks is_liked and is_saved as false for anonymous viewer', async () => {
      mockPrisma.riddles.findMany.mockResolvedValue([makeRiddle({ likes: [], saved_by: [] })]);
      mockPrisma.riddles.count.mockResolvedValue(1);

      const result = await service.getPublicFeed(undefined, 1, 10);
      expect(result.data[0].is_liked).toBe(false);
      expect(result.data[0].is_saved).toBe(false);
    });
  });

  describe('getMyPublicFeed', () => {
    it('returns only the user\'s public riddles', async () => {
      mockPrisma.riddles.findMany.mockResolvedValue([makeRiddle()]);
      mockPrisma.riddles.count.mockResolvedValue(1);

      const result = await service.getMyPublicFeed('u1', 1, 10);
      expect(result.data).toHaveLength(1);
      expect(mockPrisma.riddles.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { author_id: 'u1', is_public: true },
        }),
      );
    });
  });

  describe('getMyPrivateFeed', () => {
    it('returns only the user\'s private riddles', async () => {
      mockPrisma.riddles.findMany.mockResolvedValue([makeRiddle({ is_public: false })]);
      mockPrisma.riddles.count.mockResolvedValue(1);

      const result = await service.getMyPrivateFeed('u1', 1, 10);
      expect(mockPrisma.riddles.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { author_id: 'u1', is_public: false },
        }),
      );
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getSavedOtherFeed', () => {
    it('returns saved riddles authored by others', async () => {
      const savedRecord = { riddle: makeRiddle() };
      mockPrisma.savedRiddles.findMany.mockResolvedValue([savedRecord]);
      mockPrisma.savedRiddles.count.mockResolvedValue(1);

      const result = await service.getSavedOtherFeed('saved-by', 'viewer', 1, 10);
      expect(result.data).toHaveLength(1);
      expect(mockPrisma.savedRiddles.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ user_id: 'saved-by' }),
        }),
      );
    });
  });

  describe('getFollowingFeed', () => {
    it('returns empty data when user follows nobody', async () => {
      mockPrisma.follow.findMany.mockResolvedValue([]);

      const result = await service.getFollowingFeed('u1', 1, 10);
      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('returns riddles from followed users', async () => {
      mockPrisma.follow.findMany.mockResolvedValue([{ following_id: 'f1' }]);
      mockPrisma.riddles.findMany.mockResolvedValue([makeRiddle()]);
      mockPrisma.riddles.count.mockResolvedValue(1);

      const result = await service.getFollowingFeed('u1', 1, 10);
      expect(result.data).toHaveLength(1);
    });
  });
});
