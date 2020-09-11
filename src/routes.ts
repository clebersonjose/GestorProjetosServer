import express from "express";
import BoardsController from "./controllers/BoardsController";

const routes = express.Router();
const boardsController = new BoardsController();

routes.get("/", () => {});
routes.get("/boards", boardsController.index);
routes.post("/boards", boardsController.createColumn);

export default routes;
