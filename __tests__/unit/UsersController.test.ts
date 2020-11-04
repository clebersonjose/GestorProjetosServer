import app from '../../src/server';
import supertest from 'supertest';
import db from '../../src/database/connection';
jest.setTimeout(30000);

const request = supertest(app);

describe("Tests from user's controller", () => {
  //Testes do controller de usuários
  afterEach(async () => {
    await db('users').truncate();
  });

  it('Get users', async (done) => {
    //Chamar usuários
    const response = await request.get('/users');

    expect(response.status).toBe(200);
    done();
  });
});
