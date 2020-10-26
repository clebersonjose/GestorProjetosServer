import app from '../../src/server';
import supertest from 'supertest';
import db from '../../src/database/connection';

const request = supertest(app);

describe("Tests from columns's controller", () => {
  //Testes do controller de colunas
  afterEach(async () => {
    await db('columns').truncate();
  });

  it('Get all columns', async (done) => {
    //Chamar todas as colunas
    const response = await request.get('/columns');

    expect(response.status).toBe(200);
    done();
  });

  it('Show a column', async (done) => {
    //Mostrar coluna
    const create = await request.post('/columns').send({
      name: 'test',
      position: 1,
    });

    const getColumn = await request.get('/columns/1');

    const response = await JSON.parse(getColumn.text);

    expect(response[0].name).toBe('test');
    done();
  });

  it('Create a column', async (done) => {
    //Criar uma coluna
    const create = await request.post('/columns').send({
      name: 'test',
      position: 1,
    });

    const getColumn = await request.get('/columns');

    const response = await JSON.parse(getColumn.text);

    expect(response[0].name).toBe('test');
    done();
  });

  it('Edit a column', async (done) => {
    //Editar uma coluna
    const create = await request.post('/columns').send({
      name: 'test',
      position: 1,
    });

    const edit = await request.put('/columns').send({
      id: 1,
      name: 'Otest',
      position: 1,
    });

    const getColumn = await request.get('/columns');

    const response = await JSON.parse(getColumn.text);

    expect(response[0].name).toBe('Otest');
    done();
  });

  it('Delete a column', async (done) => {
    //Deletar uma coluna
    const create = await request.post('/columns').send({
      name: 'test',
      position: 1,
    });

    const del = await request.delete('/columns').send({
      id: 1,
    });

    const getColumn = await request.get('/columns');

    const response = await JSON.parse(getColumn.text);

    expect(response[0]).toBe(undefined);
    done();
  });
});
