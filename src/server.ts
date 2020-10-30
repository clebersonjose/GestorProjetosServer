import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes';
import errorHadler from './errors/handler';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errorHadler);

const port = process.env.NODE_ENV === 'test' ? 0 : 3333;
app.listen(port);

export default app;
