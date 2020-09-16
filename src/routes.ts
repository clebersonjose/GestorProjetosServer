import express from "express";
import BoardsController from "./controllers/BoardsController";
import ColumnsController from "./controllers/ColumnsController";

const routes = express.Router();
const boardsController = new BoardsController();
const columnsController = new ColumnsController();

routes.get("/boards", boardsController.index);
routes.post("/boards", boardsController.createColumn);

routes.get("/columns", columnsController.index);
routes.post("/columns", columnsController.createTasks);
routes.put("/columns", columnsController.editColumn);
routes.delete("/columns", columnsController.deleteColumn);

export default routes;
