import express from 'express';

import AuthController from './controllers/AuthController';
import ColumnsController from './controllers/ColumnsController';
import TasksController from './controllers/TasksController';
import UsersController from './controllers/UsersController';

const routes = express.Router();

const columnsController = new ColumnsController();
const tasksController = new TasksController();
const usersController = new UsersController();
const authController = new AuthController();

routes.get('/columns', columnsController.index);
routes.get('/columns/:id', columnsController.show);
routes.post('/columns', columnsController.create);
routes.put('/columns', columnsController.edit);
routes.delete('/columns', columnsController.delete);

routes.get('/tasks', tasksController.index);
routes.get('/tasks/:id', tasksController.show);
routes.post('/tasks', tasksController.create);
routes.put('/tasks', tasksController.edit);
routes.delete('/tasks', tasksController.delete);

routes.get('/users', usersController.index);
routes.get('/users/:id', usersController.show);
routes.post('/users', usersController.create);
routes.put('/users', usersController.edit);
routes.delete('/users', usersController.delete);

routes.post('/login', authController.login);
routes.put('/users/password', usersController.newPassword);

export default routes;
