import app from '../../src/server';
import supertest from 'supertest';
import db from '../../src/database/connection';

const request = supertest(app);

describe("Tests from columns's controller", () => {
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
    await db('columns').truncate();
  });

  it('List columns', async (done) => {
    const response = await request
      .get('/columns')
      .set('authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    done();
  });

  it('Show a column', async (done) => {
    const response = await request
      .get('/columns/1')
      .set('authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    done();
  });

  it('Create a column', async (done) => {
    const response = await request
      .post('/columns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Column 01',
        position: 1,
      });

    expect(response.status).toBe(201);
    done();
  });

  it('Edit a column', async (done) => {
    const response = await request
      .put('/columns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
        name: 'The Column 01',
        position: 1,
      });

    expect(response.status).toBe(201);
    done();
  });

  it('Delete a column', async (done) => {
    const response = await request
      .delete('/columns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
      });

    expect(response.status).toBe(201);
    done();
  });
});
