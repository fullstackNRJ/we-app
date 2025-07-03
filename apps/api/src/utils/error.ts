import { Context } from 'hono';

export const errorHandler = (err: any, c: Context) => {
  console.error('ERROR:', err);
  return c.json({ error: err?.message || 'Unexpected error' }, 500);
};