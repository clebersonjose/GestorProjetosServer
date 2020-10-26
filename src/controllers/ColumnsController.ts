import { Request, Response } from 'express';
import db from '../database/connection';

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

    try {
      await trx('columns').insert({
        name,
        position,
      });

      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while creating new column',
      });
    }
  };

  editColumn = async (request: Request, response: Response) => {
    const { id, name, position } = request.body;
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
      return response.status(400).json({
        error: 'Unexpected error while updating the column',
      });
    }
  };

  deleteColumn = async (request: Request, response: Response) => {
    const { id } = request.body;
    const trx = await db.transaction();

    try {
      await trx('columns').where({ id }).del();
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
      return response.status(400).json({
        error: 'Unexpected error while deleting the column',
      });
    }
  };
}
