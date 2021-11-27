import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { rm } from 'fs.promises';
import { AppModule } from '../src/app.module';

const request = require('supertest');

describe('users/auth modules', () => {
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

  it('handles a signup request', async () => {
    const email = '1@email.com';
    const username = '1';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(201)
      .then((res) => {
        const { id, access_token } = res.body;
        expect(id).toBeDefined();
        expect(id).toEqual(1);
        expect(access_token).toBeDefined();
      })
  });

  it('handles a signup request with a badly formatted email', async () => {
    const email = 'df';
    const username = '1';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(400)
      .then((res) => {
        const { message } = res.body;
        expect(message[0]).toEqual('email must be an email');
      })
  });

  it('handles a signup request with an empty email', async () => {
    const email = '';
    const username = '1';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(400)
      .then((res) => {
        const { message } = res.body;
        expect(message[0]).toEqual('email must be an email');
        expect(message[1]).toEqual('email should not be empty');
      })
  });

  it('handles a signup request with an empty username', async () => {
    const email = 'email@mail.com';
    const username = '';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(400)
      .then((res) => {
        const { message } = res.body;
        expect(message[0]).toEqual('username should not be empty');
      })
  });

  it('handles a signup request with an empty password', async () => {
    const email = 'email@mail.com';
    const username = 'username';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: '' })
      .expect(400)
      .then((res) => {
        const { message } = res.body;
        expect(message[0]).toEqual('password should not be empty');
      })
  });

  it('handles a signup request with an already existing email', async () => {
    const email = '1@email.com';
    const username = '1';
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(201)
      .then(async (res) => {
        const { id, access_token } = res.body;
        expect(id).toBeDefined();
        expect(id).toEqual(1);
        expect(access_token).toBeDefined();

        await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email, username: 'newUser', password: 'password' })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toEqual('email in use');
        })
      })
  });

  it('handles a signup request with an already existing username', async () => {
    const email = '1@email.com';
    const username = '1';
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(201)
      .then(async (res) => {
        const { id, access_token } = res.body;
        expect(id).toBeDefined();
        expect(id).toEqual(1);
        expect(access_token).toBeDefined();

        await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: '2@mail.com', username, password: 'password' })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toEqual('username in use');
        })
      })
  });

  it('handles a signin request', async () => {
    const email = '1@email.com';
    const username = '1';
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(201)
      .then(async (res) => {
        const { id, access_token } = res.body;
        expect(id).toBeDefined();
        expect(id).toEqual(1);
        expect(access_token).toBeDefined();

        await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username, password: 'password' })
        .expect(201)
        .then((res) => {
          const { id, access_token } = res.body;
          expect(id).toBeDefined();
          expect(id).toEqual(1);
          expect(access_token).toBeDefined();
        })
      })
  });

  it('handles a signin request with bad password', async () => {
    const email = '1@email.com';
    const username = '1';
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(201)
      .then(async (res) => {
        const { id, access_token } = res.body;
        expect(id).toBeDefined();
        expect(id).toEqual(1);
        expect(access_token).toBeDefined();

        await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username, password: 'badPassword' })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toEqual('bad password');
        })
      })
  });

  it('handles a signin request with unknown username', async () => {
    const email = '1@email.com';
    const username = '1';
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, username, password: 'password' })
      .expect(201)
      .then(async (res) => {
        const { id, access_token } = res.body;
        expect(id).toBeDefined();
        expect(id).toEqual(1);
        expect(access_token).toBeDefined();

        await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: 'unknown', password: 'password' })
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toEqual('user not found');
        })
      })
  });
});