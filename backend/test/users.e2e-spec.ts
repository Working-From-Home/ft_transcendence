import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { rm } from 'fs.promises';
import { AppModule } from '../src/app.module';

const request = require('supertest');

describe('users module', () => {
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

  it('handles a get/userId request', async () => {
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
        .get(`/users/${id}`)
        .expect(200)
        .then((res) => {
          const body = res.body;
          expect(body.id).toEqual(id);
          expect(body.username).toEqual(username);
          expect(body.email).toEqual(email);
          expect(body.avatarId).toEqual(id);
        })
      })
  });

  it('handles a get/users/userId request with bad id', async () => {
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
        .get('/users/4')
        .expect(404);
      })
  });

  it('handles a get/users?username=name request', async () => {
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
        .get(`/users?username=${username}`)
        .expect(200)
        .then((res) => {
          const body = res.body;
          expect(body.id).toEqual(id);
          expect(body.username).toEqual(username);
          expect(body.email).toEqual(email);
          expect(body.avatarId).toEqual(id);
        })
      })
  });

  it('handles a get/users?username=name request with bad username', async () => {
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
        .get('/users?username=bad')
        .expect(404);
      });
  });

  it('should block /delete operation due to a lack of authorization', async () => {
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
        .delete(`/users/${id}`)
        .expect(401)
        .then(async (res) => {
          await request(app.getHttpServer())
          .get(`/users/${id}`)
          .expect(200);
        });
      });
  });

  it('should delete a user', async () => {
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
          .delete(`/users/${id}`)
          .set({ Authorization: `Bearer ${access_token}`})
          .expect(200)
          .then(async (res) => {
              await request(app.getHttpServer())
              .get(`/users/${id}`)
              .expect(404);
              await request(app.getHttpServer())
              .get(`/avatar/${id}`)
              .expect(404);
            });
      });
  });
});