import { NextFunction, Request, Response } from 'express';
import db from '../database/connection';
import UsersView from '../views/UsersView';
import * as Yup from 'yup';
import * as bcrypt from 'bcrypt';
import User from '../models/User';
import authMiddleware from '../utils/authMiddleware';

export default class UsersController {
  index = async (request: Request, response: Response, next: NextFunction) => {
    authMiddleware(request, response);

    const users = await db('users')
      .then((data) => response.status(200).json(UsersView.renderMany(data)))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the users' });
      });

    return users;
  };

  create = async (request: Request, response: Response) => {
    const { name, email, password } = request.body;
    const data = { name, email, password };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required()
        .test(
          'uniqueEmail',
          'Esse e-mail já esta sendo utilizado.',
          async (email) => {
            return await new Promise((resolve, reject) => {
              db('users')
                .where({ email })
                .then((dados) => {
                  resolve(dados[0].email != email);
                })
                .catch(() => resolve(true));
            });
          }
        ),
      password: Yup.string()
        .required()
        .min(8)
        .max(24)
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[+@$!%*#?&])[A-Za-z\d+@$!%*#?&]{8,}$/,
          'A senha deve conter uma maiúscula, uma minúscula, um número e um carácter especial'
        ),
    });

    await schema.validate(data, { abortEarly: false });

    const saltRounds = 12;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    const trx = await db.transaction();

    try {
      await trx('users').insert({
        name,
        email,
        password: passwordHash,
      });

      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
    }
  };

  show = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const { id } = request.params;

    const user = await db('users')
      .where({ id })
      .then((data) => response.status(200).json(UsersView.renderMany(data)))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the user' });
      });

    return user;
  };

  edit = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const { id, name, email, password } = request.body;
    const data: User = { id, name, email, password };

    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required()
        .test(
          'Check if email is current email or new email unique',
          'Esse e-mail já esta sendo utilizado.',
          (email) => {
            return new Promise(async (resolve, reject) => {
              if (
                id == undefined ||
                id == '' ||
                email == undefined ||
                email == ''
              )
                resolve(false);
              const currentEmail = await db('users')
                .where({ id })
                .then((data) => data[0].email == email && true);

              const newEmail = await db('users')
                .where({ email })
                .then((dados) => (dados[0].email != email ? true : false));

              resolve(currentEmail == true ? true : newEmail);
            });
          }
        ),
      password: Yup.string()
        .required()
        .min(8)
        .max(24)
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[+@$!%*#?&])[A-Za-z\d+@$!%*#?&]{8,}$/,
          'A senha deve conter uma maiúscula, uma minúscula, um número e um carácter especial'
        )
        .test('Check password', 'Senha incorreta', async (password) => {
          if (
            id == undefined ||
            id == '' ||
            password == undefined ||
            password == ''
          )
            return false;
          const hash = await db('users')
            .where({ id })
            .then((dados) => dados[0].password);
          return bcrypt.compareSync(password, hash);
        }),
    });

    await schema.validate(data, { abortEarly: false });

    const trx = await db.transaction();

    try {
      await trx('users').where({ id }).update({
        name,
        email,
      });
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
      return response.status(401).send();
    }
  };

  delete = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const { id, password } = request.body;
    const data = { id, password };

    const schema = Yup.object().shape({
      id: Yup.number().required(),
      password: Yup.string()
        .required()
        .min(8)
        .max(24)
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[+@$!%*#?&])[A-Za-z\d+@$!%*#?&]{8,}$/,
          'A senha deve conter uma maiúscula, uma minúscula, um número e um carácter especial'
        )
        .test('Check password', 'Senha incorreta', async (password) => {
          if (id == undefined || id == '') return false;
          const hash = await db('users')
            .where({ id })
            .then((dados) => dados[0].password);
          return bcrypt.compareSync(password, hash);
        }),
    });

    await schema.validate(data, { abortEarly: false });

    const trx = await db.transaction();

    try {
      await trx('users').where({ id }).del();
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
    }
  };

  newPassword = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const { id, password, newPassword } = request.body;
    const data = { id, password, newPassword };

    const schema = Yup.object().shape({
      id: Yup.number().required(),
      password: Yup.string()
        .required()
        .min(8)
        .max(24)
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[+@$!%*#?&])[A-Za-z\d+@$!%*#?&]{8,}$/,
          'A senha deve conter uma maiúscula, uma minúscula, um número e um carácter especial'
        )
        .test('Check password', 'Senha incorreta', async (password) => {
          if (
            id == undefined ||
            id == '' ||
            password == undefined ||
            password == ''
          )
            return false;
          const hash = await db('users')
            .where({ id })
            .then((dados) => dados[0].password);
          return bcrypt.compareSync(password, hash);
        }),
      newPassword: Yup.string()
        .required()
        .min(8)
        .max(24)
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[+@$!%*#?&])[A-Za-z\d+@$!%*#?&]{8,}$/,
          'A senha deve conter uma maiúscula, uma minúscula, um número e um carácter especial'
        ),
    });

    await schema.validate(data, { abortEarly: false });

    const saltRounds = 12;
    const passwordHash = bcrypt.hashSync(newPassword, saltRounds);

    const trx = await db.transaction();

    try {
      await trx('users').where({ id }).update({
        id,
        password: passwordHash,
      });
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
    }
  };
}
