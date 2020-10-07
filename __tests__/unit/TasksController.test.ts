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
});
