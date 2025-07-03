import { serve } from '@hono/node-server';
import mongoose from 'mongoose';
import app from './app';
import { env } from './config/env';

const PORT = parseInt(env.PORT);

async function bootstrap() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ MongoDB connected');

    serve({ fetch: app.fetch, port: PORT });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}

bootstrap();