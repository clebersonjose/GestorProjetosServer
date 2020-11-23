import { Request, Response } from 'express';
import * as Yup from 'yup';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../database/connection';
import UsersView from '../views/UsersView';

export default class AuthController {
  login = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const data = {
      email,
      password,
    };

    const schema = Yup.object().shape({
      email: Yup.string()
        .test('Check e-mail', 'E-mail invalido', (value) => {
          return new Promise(async (resolve, reject) => {
            if (value == undefined || value == '') resolve(false);
            await db('users')
              .where({ email: value })
              .then((data) => {
                if (data[0] == undefined) resolve(false);
                else resolve(true);
              });
          });
        })
        .required()
        .email(),
      password: Yup.string()
        .test('Check password', 'Senha incorreta', (value) => {
          return new Promise(async (resolve, reject) => {
            if (
              email == undefined ||
              email == '' ||
              value == undefined ||
              value == ''
            )
              resolve(false);
            await db('users')
              .where({ email })
              .then((data) => {
                if (data[0] == undefined) resolve(false);
                else resolve(bcrypt.compareSync(value, data[0].password));
              });
          });
        })
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[+@$!%*#?&])[A-Za-z\d+@$!%*#?&]{8,}$/,
          'A senha deve conter uma maiúscula, uma minúscula, um número e um carácter especial'
        )
        .min(8)
        .max(24)
        .required(),
    });

    await schema.validate(data, { abortEarly: false });

    const user = await db('users')
      .where({ email })
      .then((data) => UsersView.render(data[0]));

    const token = await jwt.sign(
      { id: user.id },
      String(process.env.JWT_SECRET),
      {
        expiresIn: 86400,
      }
    );

    return response.status(200).json({ user, token }).send();
  };
}
