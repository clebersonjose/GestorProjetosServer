import { Request, Response } from "express";
import db from "../database/connection";
import { send } from "process";

export default class TasksController {
  async index(request: Request, response: Response) {
    const tasks = await db("tasks")
      .whereExists(function () {
        this.select("tasks.*")
          .from("tasks")
          .whereRaw("`tasks`.`taskCode`=`taskCode`")
          .whereRaw("`tasks`.`name`=`name`")
          .whereRaw("`tasks`.`content`=`content`")
          .whereRaw("`tasks`.`column`=`column`")
          .whereRaw("`tasks`.`position`=`position`");
      })
      .then((data) => {
        return response.status(200).json(data);
      })
      .catch(() => {
        return response.status(400).json({
          error: "Unexpected error while getting the tasks",
        });
      });
  }
  async createTask(request: Request, response: Response) {
    const { name, content, column, position } = request.body;
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
  async editTask(request: Request, response: Response) {
    const { taskCode, name, content, column, position } = request.body;
    const trx = await db.transaction();

    try {
      await trx("tasks").where({ taskCode }).update({
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
        error: "Unexpected error while updating the task",
      });
    }
  }
  async deleteTask(request: Request, response: Response) {
    const { taskCode } = request.body;
    const trx = await db.transaction();

    try {
      await trx("tasks").where({ taskCode }).del();
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
      return response.status(400).json({
        error: "Unexpected error while deleting the task",
      });
    }
  }
}
