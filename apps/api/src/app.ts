import { Context, Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { errorHandler } from './utils/error';
import testRoutes, { testRoute } from './routes/test';
import { OpenAPIHono } from '@hono/zod-openapi';
import messageRoutes from './routes/message';
import authRoutes from './routes/auth';
import budgetRoutes from './routes/budget';
import expenseRoutes from './routes/expense';

const app = new OpenAPIHono();


// Serve OpenAPI JSON and Swagger UI
app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    title: 'We app API',
    version: '1.0.0',
  },
});

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});


app.get('/swagger', (c: Context) => {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>WE App API Docs</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({
          url: '/docs',
          dom_id: '#swagger-ui'
        });
      </script>
    </body>
  </html>
  `;
  return c.html(html);
});


app.use('*', logger(), cors()); // Enable CORS and logging   // Mount test + health routes
app.onError(errorHandler);      // Central error handler
app.openapi(testRoute, testRoute.handler);
app.route('/messages', messageRoutes);
app.route('/auth', authRoutes);
app.route('/budget', budgetRoutes);
app.route('/expenses', expenseRoutes);

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export default app;