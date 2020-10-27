import { Request, Response } from 'express';
import db from '../database/connection';
import * as Yup from 'yup';

export default class ColumnsController {
  index = async (request: Request, response: Response) => {
    const columns = await db('columns')
      .whereExists(function () {
        this.select('columns.*').from('columns');
      })
      .then((data) => response.status(200).json(data))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the columns' });
      });

    return columns;
  };

  show = async (request: Request, response: Response) => {
    const { id } = request.params;

    const column = await db('columns')
      .where({ id })
      .then((data) => response.status(200).json(data))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the column' });
      });

    return column;
  };

  createColumn = async (request: Request, response: Response) => {
    const { name, position } = request.body;
    const trx = await db.transaction();

    const data = {
      name,
      position,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      position: Yup.number().required(),
    });

    await schema.validate(data, { abortEarly: false });

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

  editColumn = async (request: Request, response: Response) => {
    const { id, name, position } = request.body;
    const trx = await db.transaction();

    const data = {
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

  deleteColumn = async (request: Request, response: Response) => {
    const { id } = request.body;
    const trx = await db.transaction();

    const data = {
      id,
    };

    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    await schema.validate(data, { abortEarly: false });

    try {
      await trx('columns').where({ id }).del();
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
    }
  };
}
