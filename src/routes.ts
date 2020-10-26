import express from 'express';
import ColumnsController from './controllers/ColumnsController';
import TasksController from './controllers/TasksController';

const routes = express.Router();
const columnsController = new ColumnsController();
const tasksController = new TasksController();

routes.get('/columns', columnsController.index);
routes.get('/columns/:id', columnsController.show);
routes.post('/columns', columnsController.createColumn);
routes.put('/columns', columnsController.editColumn);
routes.delete('/columns', columnsController.deleteColumn);

routes.get('/tasks', tasksController.index);
routes.post('/tasks', tasksController.createTask);
routes.put('/tasks', tasksController.editTask);
routes.delete('/tasks', tasksController.deleteTask);

export default routes;
