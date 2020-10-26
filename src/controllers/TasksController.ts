import { Request, Response } from 'express';
import db from '../database/connection';

export default class TasksController {
  index = async (request: Request, response: Response) => {
    const tasks = await db('tasks')
      .whereExists(function () {
        this.select('tasks.*').from('tasks');
      })
      .then((data) => response.status(200).json(data))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the tasks' });
      });
    return tasks;
  };

  show = async (request: Request, response: Response) => {
    const { id } = request.params;

    const column = await db('tasks')
      .where({ id })
      .then((data) => response.status(200).json(data))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the column' });
      });

    return column;
  };

  createTask = async (request: Request, response: Response) => {
    const {
      columnId,
      //userId,
      name,
      content,
      position,
      priority,
      delivery,
      effort,
      impact,
    } = request.body;
    const trx = await db.transaction();

    try {
      await trx('tasks').insert({
        columnId,
        //userId,
        name,
        content,
        position,
        priority,
        delivery,
        effort,
        impact,
      });

      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      console.log(err);
      await trx.rollback();
      return response.status(400).json({
        error: 'Unexpected error while creating new task',
      });
    }
  };

  editTask = async (request: Request, response: Response) => {
    const {
      id,
      columnId,
      //userId,
      name,
      content,
      position,
      priority,
      delivery,
      effort,
      impact,
    } = request.body;
    const trx = await db.transaction();

    try {
      await trx('tasks').where({ id }).update({
        columnId,
        //userId,
        name,
        content,
        position,
        priority,
        delivery,
        effort,
        impact,
      });
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
      return response.status(400).json({
        error: 'Unexpected error while updating the task',
      });
    }
  };

  deleteTask = async (request: Request, response: Response) => {
    const { id } = request.body;
    const trx = await db.transaction();

    try {
      await trx('tasks').where({ id }).del();
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
      return response.status(400).json({
        error: 'Unexpected error while deleting the task',
      });
    }
  };
}
