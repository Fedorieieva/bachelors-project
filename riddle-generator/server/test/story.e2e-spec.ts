import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Express } from 'express';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('StoryController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/story/generate (POST)', async () => {
    const res = await request(app.getHttpServer() as unknown as Express)
      .post('/story/generate')
      .send({ title: 'Brave Little Fox', type: 'adventure', age: 6 })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toContain('Brave');
  });

  afterAll(async () => {
    await app.close();
  });
});
