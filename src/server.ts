import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { initConnection } from './utils/database';
import { ensureDisplayOrderColumns } from './utils/ensureDisplayOrder';
import routes from './routes';
import mediaRoutes from './routes/media';

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize database connections
const initializeDatabase = async () => {
  try {
    // Initialize MySQL for all features
    await initConnection();
    console.log('✅ MySQL database initialized successfully');

    await ensureDisplayOrderColumns();

    console.log('Database initialization completed');
  } catch (error: any) {
    console.error('Critical database initialization failed:', error.message);
    process.exit(1);
  }
};

initializeDatabase();

const corsOptions: cors.CorsOptions = {
  origin: [
    'https://www.ahwuae.com',
    'https://ahwuae.com',
    'https://investoreducation.ahwuae.com',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute instead of 15
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // 1000 requests per minute for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (req.method === 'OPTIONS') return true;
    return process.env.NODE_ENV === 'development';
  }
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());
app.use(limiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', mediaRoutes);

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'UASA Investor Education Portal API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      home: '/api/home',
      about: '/api/about',
      investorEducation: '/api/investor-education',
      glossary: '/api/glossary',
      feedback: '/api/feedback',
      admin: '/api/admin'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Documentation: http://localhost:${PORT}/`);
});
