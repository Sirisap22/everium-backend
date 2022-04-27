import express, { Application, json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet'
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middlewares/error.middleware';
import * as scheduler from './utils/scheduler.utils';
import authorize from './middlewares/authorization.middelware';
import UserRole from './users/user-role.enum';
import { resolve } from 'path';

class App {
  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.schedulingTasks();
    this.initializeErrorHandling();

  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    })
  }

  private initializeMiddlewares() {
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    }));
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true
      })
    );
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }))
    this.app.use(express.static('public'));
    this.app.use('/private', [...authorize([UserRole.Admin]), express.static(resolve(__dirname, '../private'))])
  };

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controllers) => {
      this.app.use('/', controllers.router);
    });
  }

  private schedulingTasks() {
    scheduler.scheduleResetUserUsedPromotePostsEveryFirstDayOfMonth();
  }

  private connectToTheDatabase() {
    const {
      DEV_MONGO_PATH,
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH
    } = process.env;

    if (process.env.ENVIRONMENT === 'production') {
      mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`, (error) => {
        if (error)
          console.log(error)
        else
          console.log('Connected to mongodb in production mode')
      });
    } else {
      mongoose.connect(`mongodb://${DEV_MONGO_PATH}`, (error) => {
        if (error)
          console.log(error)
        else
          console.log('Connected to mongodb in developement mode')
      });
    }
  }
}

export default App;