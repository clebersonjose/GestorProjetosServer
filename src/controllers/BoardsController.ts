import { Request, Response } from "express";
import db from "../database/connection";

interface ColumnInterface {
  columnCode: number;
  name: string;
  position: number;
}

export default class BoardsController {
  async index(request: Request, response: Response) {}

  async createColumn(request: Request, response: Response) {
    const { name, position } = request.body;
    const trx = await db.transaction();

    try {
      await trx("columns").insert({
        name,
        position,
      });

      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: "Unexpected error while creating new column",
      });
    }
  }
}
