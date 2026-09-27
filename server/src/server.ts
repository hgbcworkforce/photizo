import app from './app';
import { env } from './config/env';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Photizo Backend Server running on port ${PORT} [${env.NODE_ENV}]`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
});

// Graceful Shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
