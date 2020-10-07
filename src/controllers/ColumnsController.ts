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
    const { columnCode, name, position } = request.body;
    const trx = await db.transaction();

    try {
      await trx('columns').where({ columnCode }).update({
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
    const { columnCode } = request.body;
    const trx = await db.transaction();

    try {
      await trx('columns').where({ columnCode }).del();
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
