import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/authRoutes.js';
import livreRoutes from './routes/livreRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerSpec } from './docs/swagger.js';

dotenv.config();

const app = express();

// Sécurité & Logging
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' })); // Protection contre payloads trop lourds
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Gestion globale des erreurs
app.use(errorHandler);
   
export default app;