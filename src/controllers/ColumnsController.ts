import { Request, Response } from 'express';
import db from '../database/connection';
import * as Yup from 'yup';
import Column from '../models/Column';
import ColumnsView from '../views/ColumnsView';
import authMiddleware from '../utils/authMiddleware';

export default class ColumnsController {
  index = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const columns = await db('columns')
      .then((data) => response.status(200).json(ColumnsView.renderMany(data)))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the columns' });
      });

    return columns;
  };

  show = async (request: Request, response: Response) => {
    authMiddleware(request, response);
    const { id } = request.params;

    const column = await db('columns')
      .where({ id })
      .then((data) => response.status(200).json(ColumnsView.renderMany(data)))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the column' });
      });

    return column;
  };

  create = async (request: Request, response: Response) => {
    authMiddleware(request, response);
    const { name, position } = request.body;

    const data = {
      name,
      position,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      position: Yup.number().required(),
    });

    await schema.validate(data, { abortEarly: false });

    const trx = await db.transaction();

    try {
      await trx('columns').insert({
        name,
        position,
      });

      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
    }
  };

  edit = async (request: Request, response: Response) => {
    authMiddleware(request, response);
    const { id, name, position } = request.body;

    const data: Column = {
      id,
      name,
      position,
    };

    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      position: Yup.number().required(),
    });

    await schema.validate(data, { abortEarly: false });

    const trx = await db.transaction();

    try {
      await trx('columns').where({ id }).update({
        name,
        position,
      });
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
    }
  };

  delete = async (request: Request, response: Response) => {
    authMiddleware(request, response);
    const { id } = request.body;

    const data = {
      id,
    };

    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    await schema.validate(data, { abortEarly: false });

    const trx = await db.transaction();

    try {
      await trx('columns').where({ id }).del();
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
    }
  };
}
