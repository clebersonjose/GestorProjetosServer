import { Request, Response } from 'express';
import db from '../database/connection';
import * as Yup from 'yup';
import Task from '../models/Task';
import TasksView from '../views/TasksView';
import authMiddleware from '../utils/authMiddleware';

export default class TasksController {
  index = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const tasks = await db('tasks')
      .then((data) => response.status(200).json(TasksView.renderMany(data)))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the tasks' });
      });

    return tasks;
  };

  show = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const { id } = request.params;

    const column = await db('tasks')
      .where({ id })
      .then((data) => response.status(200).json(TasksView.renderMany(data)))
      .catch(() => {
        response
          .status(400)
          .json({ error: 'Unexpected error while getting the column' });
      });

    return column;
  };

  create = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const {
      columnId,
      userId,
      name,
      content,
      position,
      priority,
      delivery,
      effort,
      impact,
    } = request.body;

    const data = {
      columnId,
      userId,
      name,
      content,
      position,
      priority,
      delivery,
      effort,
      impact,
    };

    const schema = Yup.object().shape({
      columnId: Yup.number().required(),
      userId: Yup.number().notRequired(),
      name: Yup.string().required(),
      content: Yup.string().required(),
      position: Yup.number().required(),
      priority: Yup.mixed().oneOf(['1', '2', '3', '4', '5']),
      delivery: Yup.date().required(),
      effort: Yup.mixed().oneOf(['1', '2', '3', '4', '5']),
      impact: Yup.mixed().oneOf(['1', '2', '3', '4', '5']),
    });

    await schema.validate(data, { abortEarly: false });

    const trx = await db.transaction();

    try {
      await trx('tasks').insert({
        columnId,
        userId,
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
    }
  };

  edit = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const {
      id,
      columnId,
      userId,
      name,
      content,
      position,
      priority,
      delivery,
      effort,
      impact,
    } = request.body;

    const data: Task = {
      id,
      columnId,
      userId,
      name,
      content,
      position,
      priority,
      delivery,
      effort,
      impact,
    };

    const schema = Yup.object().shape({
      id: Yup.number().required(),
      columnId: Yup.number().required(),
      userId: Yup.number().notRequired(),
      name: Yup.string().required(),
      content: Yup.string().required(),
      position: Yup.number().required(),
      priority: Yup.mixed().oneOf(['1', '2', '3', '4', '5']),
      delivery: Yup.date().required(),
      effort: Yup.mixed().oneOf(['1', '2', '3', '4', '5']),
      impact: Yup.mixed().oneOf(['1', '2', '3', '4', '5']),
    });

    await schema.validate(data, { abortEarly: false });

    const trx = await db.transaction();

    try {
      await trx('tasks').where({ id }).update({
        columnId,
        userId,
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
    }
  };

  delete = async (request: Request, response: Response) => {
    authMiddleware(request, response);

    const { id } = request.body;
    const data = { id };

    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    await schema.validate(data, { abortEarly: false });

    const trx = await db.transaction();

    try {
      await trx('tasks').where({ id }).del();
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
    }
  };
}
