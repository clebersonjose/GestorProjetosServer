import app from '../../src/server';
import supertest from 'supertest';
import db from '../../src/database/connection';

const request = supertest(app);

describe("Tests from tasks's controller", () => {
  let token: string;

  beforeAll(async (done) => {
    await request.post('/users').send({
      name: 'User 01',
      email: 'user01@user.com',
      password: 'a1234567+8',
    });

    await request
      .post('/login')
      .send({
        email: 'user01@user.com',
        password: 'a1234567+8',
      })
      .then((response) => {
        token = response.body.token;
        done();
      });
  });

  afterAll(async (done) => {
    await db('users').truncate();
    done();
  });

  afterEach(async () => {
    await db('tasks').truncate();
  });

  it('List tasks', async (done) => {
    const response = await request
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    done();
  });

  it('Show a task', async (done) => {
    const response = await request
      .get('/tasks/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    done();
  });

  it('Create task', async (done) => {
    const response = await request
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        columnId: 1,
        name: 'Task 01',
        content: 'Task description',
        position: 1,
        priority: '3',
        delivery: new Date(),
        effort: '3',
        impact: '3',
      });

    expect(response.status).toBe(201);
    done();
  });

  it('Edit task', async (done) => {
    const response = await request
      .put('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
        columnId: 1,
        name: 'The task 01',
        content: 'The task description',
        position: 1,
        priority: '3',
        delivery: new Date(),
        effort: '3',
        impact: '3',
      });

    expect(response.status).toBe(201);
    done();
  });

  it('Delete task', async (done) => {
    const response = await request
      .delete('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
      });

    expect(response.status).toBe(201);
    done();
  });
});
