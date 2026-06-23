import { env } from './config/env.js';
import app from './app.js';
import { testConnection } from './config/database.js';

async function start() {
  try {
    console.log('\ud83d\udd0d Testing database connection...');
    await testConnection();
    console.log('\u2705 Database connection established');
    const server = app.listen(env.PORT, () => {
      console.log(`\ud83d\ude80 Server running at http://localhost:${env.PORT}`);
      console.log(`   Environment: ${env.NODE_ENV}`);
      console.log(`   Health: http://localhost:${env.PORT}/health`);
      console.log(`   API:    http://localhost:${env.PORT}/api/products`);
    });
    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => { console.log('\u2705 HTTP server closed'); process.exit(0); });
      setTimeout(() => { process.exit(1); }, 10000);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (r) => console.error('Unhandled Rejection:', r));
    process.on('uncaughtException', (e) => { console.error('Uncaught Exception:', e.message); process.exit(1); });
  } catch (err) {
    console.error('\u274c Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
