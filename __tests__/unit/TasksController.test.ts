import app from '../../src/server';
import supertest from 'supertest';
import db from '../../src/database/connection';

const request = supertest(app);

describe("Tests from tasks's controller", () => {
  //Testes do controller de tarefas
  afterEach(async () => {
    await db('tasks').truncate();
  });

  it('Get tasks', async (done) => {
    //Chamar tarefas
    const response = await request.get('/tasks');

    expect(response.status).toBe(200);
    done();
  });

  it('Show a task', async (done) => {
    //Mostrar tarefa
    const create = await request.post('/tasks').send({
      columnId: 1,
      userId: null,
      name: 'test',
      content: 'text',
      position: 1,
      priority: '3',
      delivery: new Date(),
      effort: '3',
      impact: '3',
    });

    const getTask = await request.get('/tasks/1');

    const response = await JSON.parse(getTask.text);

    expect(response[0].name).toBe('test');
    done();
  });

  it('Create task', async (done) => {
    //Criar uma tarefa
    const create = await request.post('/tasks').send({
      columnId: 1,
      userId: null,
      name: 'test',
      content: 'text',
      position: 1,
      priority: '3',
      delivery: new Date(),
      effort: '3',
      impact: '3',
    });

    const getTask = await request.get('/tasks');

    const response = await JSON.parse(getTask.text);
    expect(response[0].name).toBe('test');
    done();
  });

  it('Edit task', async (done) => {
    //Editar tarefa
    const create = await request.post('/tasks').send({
      columnId: 1,
      userId: null,
      name: 'test',
      content: 'text',
      position: 1,
      priority: '3',
      delivery: new Date(),
      effort: '3',
      impact: '3',
    });

    const edit = await request.put('/tasks').send({
      id: 1,
      columnId: 1,
      userId: null,
      name: 'New name',
      content: 'text',
      position: 1,
      priority: '3',
      delivery: new Date(),
      effort: '3',
      impact: '3',
    });

    const getTask = await request.get('/tasks');

    const response = await JSON.parse(getTask.text);

    expect(response[0].name).toBe('New name');
    done();
  });

  it('Delete task', async (done) => {
    //Deletar tarefa
    const create = await request.post('/tasks').send({
      columnId: 1,
      userId: null,
      name: 'test',
      content: 'text',
      position: 1,
      priority: '3',
      delivery: new Date(),
      effort: '3',
      impact: '3',
    });

    const del = await request.delete('/tasks').send({
      id: 1,
    });

    const getTask = await request.get('/tasks');

    const response = await JSON.parse(getTask.text);

    expect(response[0]).toBe(undefined);
    done();
  });
});
