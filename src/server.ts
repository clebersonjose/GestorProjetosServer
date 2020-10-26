import express from 'express';
import cors from 'cors';
import routes from './routes';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

const port = process.env.NODE_ENV === 'test' ? 0 : 3333;

app.listen(port);

export default app;
