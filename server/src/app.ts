import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';

const app = express();

// Trust reverse proxy (Render / Cloudflare) for accurate IP resolution in rate-limiting
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'https://bisum.org',
  'https://www.bisum.org',
  'https://bisum.hgbcinfluencers.org',
  'https://hgbcinfluencers.org',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Allow all during testing or restrict to allowedOrigins
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-paystack-signature'],
  })
);

// Morgan HTTP request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// JSON Body Parser with raw body buffer preservation (vital for Paystack HMAC verification)
app.use(
  express.json({
    limit: '2mb',
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: true }));

// Global Rate Limiter for DDoS / abuse prevention
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

app.use('/api', limiter);

// Mount API Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'BISUM Conference API Backend',
    status: 'healthy',
    documentation: '/api/health',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
