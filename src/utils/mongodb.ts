import mongoose from 'mongoose';
import { envConfig } from '~/constants/config';

export default class MongoDB {
  private static instance: MongoDB;
  private constructor() {}

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async newConnection(): Promise<void> {
    try {
      await mongoose.connect(envConfig.dbConnectionString);
      console.log('Successful database connection!');
    } catch (err) {
      console.error('Database connection error:');
    }
  }
}
