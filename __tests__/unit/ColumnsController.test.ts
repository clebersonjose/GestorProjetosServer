import app from '../../src/server';
import supertest from 'supertest';
import db from '../../src/database/connection';

const request = supertest(app);

describe("Tests from columns's controller", () => {
  afterEach(async () => {
    await db('columns').truncate();
  });

  it('Get columns', async (done) => {
    const response = await request.get('/columns');

    expect(response.status).toBe(200);
    done();
  });

  it('Create column', async (done) => {
    const create = await request.post('/columns').send({
      name: 'test',
      position: 1,
    });

    const getColumn = await request.get('/columns');

    const response = await JSON.parse(getColumn.text);

    expect(response[0].name).toBe('test');
    done();
  });

  it('Edit column', async (done) => {
    const create = await request.post('/columns').send({
      name: 'test',
      position: 1,
    });

    const edit = await request.put('/columns').send({
      columnCode: 1,
      name: 'Otest',
      position: 1,
    });

    const getColumn = await request.get('/columns');

    const response = await JSON.parse(getColumn.text);
    
    expect(response[0].name).toBe('Otest');
    done();
  });
});
