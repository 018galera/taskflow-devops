const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

beforeAll((done) => {
  db.run('DELETE FROM tasks', done);
});

afterAll((done) => {
  db.close(done);
});

describe('API de Tarefas', () => {
  test('GET /health deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/tasks deve retornar lista vazia', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/tasks deve criar uma tarefa', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Estudar DevOps' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Estudar DevOps');
  });

  test('POST /api/tasks sem título deve retornar 400', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.statusCode).toBe(400);
  });

  test('PATCH /api/tasks/:id deve marcar como concluída', async () => {
    const create = await request(app).post('/api/tasks').send({ title: 'Testar PATCH' });
    const res = await request(app).patch(`/api/tasks/${create.body.id}`).send({ done: true });
    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/tasks/:id deve remover a tarefa', async () => {
    const create = await request(app).post('/api/tasks').send({ title: 'Testar DELETE' });
    const res = await request(app).delete(`/api/tasks/${create.body.id}`);
    expect(res.statusCode).toBe(204);
  });
});