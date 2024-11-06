import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { envConfig } from './constants/config';
import MongoDB from '../src/utils/mongodb';

import usersRouter from './routes/user.routes';
import coursesRouter from './routes/course.routes';
import studentsRouter from './routes/student.routes';
import attendancesRouter from './routes/attendance.routes';
import tuitionFeesRouter from './routes/tuition-fee.routes';
import gradesRouter from './routes/grade.routes';

import HTTP_STATUS from './constants/httpStatus';
import AppError from './utils/app-error';
import globalErrorHandler from './controllers/error.controllers';

// Create a new MongoDB instance
MongoDB.getInstance().newConnection();

const app = express();
app.use(express.json());

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);
app.use(morgan('dev'));
app.use(express.json());

// ROUTES
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/students', studentsRouter);
app.use('/api/v1/attendances', attendancesRouter);
app.use('/api/v1/tuition-fees', tuitionFeesRouter);
app.use('/api/v1/grades', gradesRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, HTTP_STATUS.NOT_FOUND));
});

app.use(globalErrorHandler);

app.listen(envConfig.port, () => {
  console.log(`App is listening on port ${envConfig.port}`);
});
