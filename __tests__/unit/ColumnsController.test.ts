import app from '../../src/server'; // Link to your server file
import supertest from 'supertest';
import db from '../../src/database/connection';

const request = supertest(app);

describe("Tests from columns's controller", () => {
  afterEach(async (done) => {
    await db('columns').whereNot('columnCode', null).del();
    done();
  });

  it('Get columns', async (done) => {
    const response = await request.get('/columns');
    expect(response.status).toBe(200);
    done();
  });

  it('Create column', async (done) => {
    const response = await request.post('/columns').send({
      name: 'test',
      position: 1,
    });
    expect(response.status).toBe(201);
    done();
  });
});
