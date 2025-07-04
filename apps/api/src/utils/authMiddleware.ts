import { verifyAccessToken } from './jwt';
import { Context, Next } from 'hono';

export function requireAuth(roles?: string[]) {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyAccessToken(token) as { id: string; name: string; role?: string };
      if (roles && (!payload.role || !roles.includes(payload.role))) {
        return c.json({ error: 'Forbidden' }, 403);
      }
      c.set('user', { id: payload.id, name: payload.name, role: payload.role });
      await next();
    } catch (e) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
  };
} 