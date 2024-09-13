import bluebird from 'bluebird';
import mongoose from 'mongoose';

import logger from '../libs/logger';

export default function connectMongo() {
  // Connect to MongoDB
  const mongoUrl = process.env.MONGO_URL || '';
  mongoose.Promise = bluebird;

  mongoose
    .connect(mongoUrl)
    .then(() => {
      /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    })
    .catch((err: any) => {
      logger.error(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
      // process.exit();
    });
}
