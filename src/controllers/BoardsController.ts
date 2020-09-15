import { Request, Response } from "express";
import db from "../database/connection";

interface ColumnInterface {
  columnCode: number;
  name: string;
  position: number;
}

export default class BoardsController {
  async index(request: Request, response: Response) {
    const columns = await db("columns")
      .whereExists(function () {
        this.select("columns.*")
          .from("columns")
          .whereRaw("`columns`.`columnCode`=`columnCode`")
          .whereRaw("`columns`.`name`=`name`")
          .whereRaw("`columns`.`position`=`position`");
      })
      .then((data) => {
        return response.status(200).json(data);
      })
      .catch(() => {
        return response.status(400).json({
          error: "Unexpected error while getting the columns",
        });
      });
    return columns;
  }

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
