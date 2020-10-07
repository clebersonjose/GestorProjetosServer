import app from '../../src/server';
import supertest from 'supertest';
import db from '../../src/database/connection';

const request = supertest(app);

describe("Tests from tasks's controller", () => {
  afterEach(async () => {
    await db('tasks').truncate();
  });

  it('Get tasks', async (done) => {
    const response = await request.get('/tasks');

    expect(response.status).toBe(200);
    done();
  });

  it('Create task', async (done) => {
    const create = await request.post('/tasks').send({
      name: 'test',
      content: 'text',
      column: 1,
      position: 1,
    });

    const getTask = await request.get('/tasks');

    const response = await JSON.parse(getTask.text);

    expect(response[0].name).toBe('test');
    done();
  });

  it('Edit task', async (done) => {
    const create = await request.post('/tasks').send({
      name: 'test',
      content: 'text',
      column: 1,
      position: 1,
    });

    const edit = await request.put('/tasks').send({
      taskCode: 1,
      name: 'New name',
      content: 'text',
      column: 1,
      position: 1,
    });

    const getTask = await request.get('/tasks');

    const response = await JSON.parse(getTask.text);

    expect(response[0].name).toBe('New name');
    done();
  });
});
