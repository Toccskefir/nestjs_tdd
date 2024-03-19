import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoModule } from './todo.module';
import { Todo } from './todo.model';
import { PrismaService } from '../prisma/prisma.service';

describe('TodoController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.get<PrismaService>(PrismaService).todo.deleteMany();
    await app.init();
  });

  it('/todos (GET)', () => {
    return request(app.getHttpServer()).get('/todos').expect(200).expect([]);
  });

  it('/todos (GET) exists', async () => {
    const req = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'test' });
    const todo = req.body as Todo;
    return request(app.getHttpServer())
      .get(`/todos/${todo.id}`)
      .expect(200)
      .expect({ text: 'test', id: todo.id });
  });

  it('/todos (GET) with invalid id', async () => {
    return request(app.getHttpServer()).get('/todos/42').expect(200).expect({});
  });

  it('/todos (POST)', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'test' })
      .expect(201)
      .expect((response) => {
        expect(response.body).toEqual({ text: 'test', id: expect.any(String) });
      });
  });

  it('/todos (POST) empty body', () => {
    return request(app.getHttpServer()).post('/todos').send({}).expect(400);
  });

  it('/todos (POST) incorrect field type', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ text: 23 })
      .expect(400);
  });

  it('/todos (POST) extra todo field', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'test', extra: 'extra' })
      .expect(400);
  });

  it('/todos (PUT) todo updates', async () => {
    const postReq = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'test' });
    const todo = postReq.body as Todo;

    await request(app.getHttpServer())
      .put(`/todos/${todo.id}`)
      .send({ text: 'after update' });

    return request(app.getHttpServer())
      .get(`/todos/${todo.id}`)
      .expect(200)
      .expect({ text: 'after update', id: todo.id });
  });

  it('/todos (PUT) with invalid id', () => {
    return request(app.getHttpServer())
      .put('/todos/42')
      .send({ text: 'after update' })
      .expect(404);
  });

  it('/todos (DELETE) delete todo', async () => {
    const postReq = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'test' });
    const todo = postReq.body as Todo;

    await request(app.getHttpServer()).delete(`/todos/${todo.id}`);

    return request(app.getHttpServer()).get(`/todos/${todo.id}`).expect(200);
  });

  it('/todos (DELETE) with invalid id', () => {
    return request(app.getHttpServer()).delete('/todos/42').expect(200);
  });
});
