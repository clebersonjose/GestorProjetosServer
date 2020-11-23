import app from '../../src/server';
import supertest from 'supertest';
import db from '../../src/database/connection';

const request = supertest(app);

describe("Tests from user's controller", () => {
  let token: string;

  beforeEach(async (done) => {
    await db('users').truncate();

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

  it('Get users', async (done) => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    done();
  });

  it('Create user', async (done) => {
    const response = await request.post('/users').send({
      name: 'User 02',
      email: 'user02@user.com',
      password: 'a1234567+8',
    });

    expect(response.status).toBe(201);
    done();
  });

  it('Show user', async (done) => {
    const response = await request
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    done();
  });

  it('Edit user', async (done) => {
    const response = await request
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
        name: 'The user 01',
        email: 'user01@user.com',
        password: 'a1234567+8',
      });

    expect(response.status).toBe(201);
    done();
  });

  it('Delete user', async (done) => {
    const response = await request
      .delete('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
        password: 'a1234567+8',
      });

    expect(response.status).toBe(201);
    done();
  });

  it("Change user's password", async (done) => {
    const response = await request
      .put('/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
        password: 'a1234567+8',
        newPassword: 'b1234567+89',
      });

    expect(response.status).toBe(201);
    done();
  });
});
