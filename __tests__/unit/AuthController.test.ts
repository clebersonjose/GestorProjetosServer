import app from '../../src/server';
import supertest from 'supertest';
import db from '../../src/database/connection';

const request = supertest(app);

describe('Test for the authentication controller', () => {
  beforeAll(async (done) => {
    await request.post('/users').send({
      name: 'User 01',
      email: 'user01@user.com',
      password: 'a1234567+8',
    });

    done();
  });

  afterAll(async (done) => {
    await db('users').truncate();
    done();
  });

  it('Login test successful', async (done) => {
    const response = await request.post('/login').send({
      email: 'user01@user.com',
      password: 'a1234567+8',
    });

    expect(response.status).toBe(200);
    done();
  });

  it('Login with empty fields', async (done) => {
    const response = await request.post('/login').send({
      email: '',
      password: '',
    });
    expect(response.status).toBe(400);
    done();
  });

  it('Login with empty email', async (done) => {
    const response = await request.post('/login').send({
      email: '',
      password: 'a1234567+8',
    });

    expect(JSON.parse(String(response.text))['errors']['email'][0]).toBe(
      'email é um campo obrigatório'
    );
    done();
  });

  it('Login with email in wrong format', async (done) => {
    const response = await request.post('/login').send({
      email: 'user01usercom',
      password: 'a1234567+8',
    });

    expect(JSON.parse(String(response.text))['errors']['email'][0]).toBe(
      'email tem o formato de e-mail inválido'
    );
    done();
  });

  it('Login with wrong email', async (done) => {
    const response = await request.post('/login').send({
      email: 'user02@user.com',
      password: 'a1234567+8',
    });

    expect(JSON.parse(String(response.text))['errors']['email'][0]).toBe(
      'E-mail invalido'
    );
    done();
  });

  it('Login with empty password', async (done) => {
    const response = await request.post('/login').send({
      email: 'user01@user.com',
      password: '',
    });

    expect(JSON.parse(String(response.text))['errors']['password'][0]).toBe(
      'password é um campo obrigatório'
    );
    done();
  });

  it('Login with password in wrong format', async (done) => {
    const response = await request.post('/login').send({
      email: 'user01@user.com',
      password: 'a12345678',
    });

    expect(JSON.parse(String(response.text))['errors']['password'][0]).toBe(
      'A senha deve conter uma maiúscula, uma minúscula, um número e um carácter especial'
    );
    done();
  });

  it('Login with password less than 8 characters', async (done) => {
    const response = await request.post('/login').send({
      email: 'user01@user.com',
      password: '1234567',
    });

    expect(JSON.parse(String(response.text))['errors']['password'][0]).toBe(
      'password deve ter pelo menos 8 caracteres'
    );
    done();
  });

  it('Login with password longer than 24 characters', async (done) => {
    const response = await request.post('/login').send({
      email: 'user01@user.com',
      password: '123456789123456789123456789Aa+',
    });

    expect(JSON.parse(String(response.text))['errors']['password'][0]).toBe(
      'password deve ter no máximo 24 caracteres'
    );
    done();
  });

  it('Login with wrong password', async (done) => {
    const response = await request.post('/login').send({
      email: 'user01@user.com',
      password: 'a234567+89',
    });

    expect(JSON.parse(String(response.text))['errors']['password'][0]).toBe(
      'Senha incorreta'
    );
    done();
  });
});
