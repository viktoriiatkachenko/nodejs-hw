import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongoDB();

  const app = express();

  app.use(logger);
  app.use(express.json());

  app.use(
    cors({
      origin: process.env.FRONTEND_DOMAIN,
      credentials: true,
    }),
  );

  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running successfully' });
  });

  // routes
  app.use(notesRoutes);
  app.use(authRoutes);
  app.use(userRoutes);

  // ❗ ВАЖНО: 404 ДО errors()
  app.use(notFoundHandler);

  // celebrate errors
  app.use(errors());

  // global error handler
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();