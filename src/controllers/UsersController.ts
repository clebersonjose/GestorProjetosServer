import { Request, Response } from 'express';
import db from '../database/connection';

export default class UsersController {
  index = async (request: Request, response: Response) => {
    const users = await db('users')
      .whereExists(function () {
        this.select('users.*').from('users');
      })
      .then((data) => response.status(200).json(data))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the users' });
      });
    return users;
  };
}
