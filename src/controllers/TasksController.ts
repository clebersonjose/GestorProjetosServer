import { Request, Response } from "express";
import db from "../database/connection";

export default class TasksController {
  async index(request: Request, response: Response) {}
  async createTask(request: Request, response: Response) {
    const { taskCode, name, content, column, position } = request.body;
    const trx = await db.transaction();

    try {
      await trx("tasks").insert({
        name,
        content,
        column,
        position,
      });

      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: "Unexpected error while creating new task",
      });
    }
  }
  async editTask(request: Request, response: Response) {}
  async deleteTask(request: Request, response: Response) {}
}
