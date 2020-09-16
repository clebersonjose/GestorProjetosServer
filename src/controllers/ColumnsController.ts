import { Request, Response } from "express";
import db from "../database/connection";

export default class ColumnsController {
  async index() {}
  async createTasks() {}

  async editColumn(request: Request, response: Response) {
    const { columnCode, name, position } = request.body;
    const trx = await db.transaction();

    try {
      await trx("columns").where({ columnCode }).update({
        name,
        position,
      });
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
      return response.status(400).json({
        error: "Unexpected error while updating the column",
      });
    }
  }

  async deleteColumn(request: Request, response: Response) {
    const { columnCode } = request.body;
    const trx = await db.transaction();

    try {
      await trx("columns").where({ columnCode }).del();
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
      return response.status(400).json({
        error: "Unexpected error while deleting the column",
      });
    }
  }
}
