import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

import extendedBodyParser from './middlewares/extended-body-parser';

import healthRouter from './routes/health';
import employeeRouter from './routes/employee';

const server = express();

// Setup middlewares
server.use(extendedBodyParser.javascript());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());
server.use(compression());
server.use(helmet());

// Setup Routers
server.use('/health', healthRouter);
server.use('/employee', employeeRouter);

export default server;
