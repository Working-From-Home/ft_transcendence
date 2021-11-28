import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { rm } from 'fs.promises';
import { AppModule } from '../src/app.module';

const request = require('supertest');

describe('avatar module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    try { await app.close(); } catch(err) {}
    try { await rm(join(__dirname, '..', 'test.sqlite')); } catch(err) {}
  });

  it('should return avatar', async () => {
    const email = '1@email.com';
    const username = '1';
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(201)
      .then(async (res) => {
        const { id, access_token } = res.body;
        expect(id).toBeDefined();
        expect(access_token).toBeDefined();
        
        await request(app.getHttpServer())
          .get(`/users/${id}/avatar`)
          .then(async (res) => {
              expect(200);
          });
      });
  });
});