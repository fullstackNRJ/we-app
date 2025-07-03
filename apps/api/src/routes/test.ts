import { Context, Hono } from 'hono';
import { z, createRoute } from '@hono/zod-openapi';

export const TestResponseSchema = z.object({
  message: z.string(),
})

const testRoutes = new Hono();

testRoutes.get('/health', (c) => {
  return c.json({ status: 'ok', uptime: process.uptime() });
});

export default testRoutes;

export const testRoute = createRoute({
  method: 'get',
  path: '/test',
  responses: {
    200: {
      description: 'Test response',
      content: {
        'application/json': {
          schema: TestResponseSchema,
        },
      },
    },
  },
  handler: (c: Context) => {
    return c.json({ message: 'Hello, world!' }, 200);
  },
});



