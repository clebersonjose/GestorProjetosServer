import express from 'express';
import ColumnsController from './controllers/ColumnsController';
import TasksController from './controllers/TasksController';
import UsersController from './controllers/UsersController';

const routes = express.Router();
const columnsController = new ColumnsController();
const tasksController = new TasksController();
const usersController = new UsersController();

routes.get('/columns', columnsController.index);
routes.get('/columns/:id', columnsController.show);
routes.post('/columns', columnsController.createColumn);
routes.put('/columns', columnsController.editColumn);
routes.delete('/columns', columnsController.deleteColumn);

routes.get('/tasks', tasksController.index);
routes.get('/tasks/:id', tasksController.show);
routes.post('/tasks', tasksController.createTask);
routes.put('/tasks', tasksController.editTask);
routes.delete('/tasks', tasksController.deleteTask);

routes.get('/users', usersController.index);

export default routes;
