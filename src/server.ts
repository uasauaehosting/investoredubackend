import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { initConnection } from './utils/database';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize database connections
const initializeDatabase = async () => {
  try {
    // Initialize MySQL for all features
    await initConnection();
    console.log('✅ MySQL database initialized successfully');
    
    console.log('Database initialization completed');
  } catch (error: any) {
    console.error('Critical database initialization failed:', error.message);
    process.exit(1);
  }
};

initializeDatabase();

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute instead of 15
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // 1000 requests per minute for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for development
    return process.env.NODE_ENV === 'development';
  }
});

app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080',
    ];

    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    if (process.env.FRONTEND_URLS) {
      allowedOrigins.push(
        ...process.env.FRONTEND_URLS.split(',').map((o) => o.trim()).filter(Boolean),
      );
    }

    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    try {
      const { hostname } = new URL(origin);
      if (
        hostname === 'ahwuae.com' ||
        hostname.endsWith('.ahwuae.com') ||
        hostname.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
    } catch {
      // invalid origin URL
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
