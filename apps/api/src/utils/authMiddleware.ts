import { verifyAccessToken } from './jwt';
import { Context, Next } from 'hono';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token) as { id: string; name: string };
    c.set('user', { id: payload.id, name: payload.name });
    await next();
  } catch (e) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
} 