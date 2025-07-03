import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi';
import { Context } from 'hono';
import { MessageService } from '../services/messageService';

// create a new sub route app instance
const messageRoutes = new OpenAPIHono();

const MessageSchema = z.object({
  _id: z.string(),
  text: z.string(),
  createdAt: z.string(),
});

const CreateMessageSchema = z.object({
  text: z.string().min(1),
});

// create a new route
 const getMessagesRoute = createRoute({
  tags: ['messages'],
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'List all messages',
      content: {
        'application/json': {
          schema: z.array(MessageSchema),
        },
      },
    },
  },
  handler: async (c: Context) => {
    const messages = await MessageService.getMessages();
    return c.json(messages, 200);
  },
});

 const createMessageRoute = createRoute({
  tags: ['messages'],
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateMessageSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Message created',
      content: {
        'application/json': {
          schema: MessageSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({ error: z.string(), details: z.any() }),
        },
      },
    },
  },
  handler: async (c: Context) => {
    const body = await c.req.json();
    const parse = CreateMessageSchema.safeParse(body);
    if (!parse.success) {
      return c.json({ error: 'Invalid input', details: parse.error.errors }, 400);
    }
    const message = await MessageService.createMessage(parse.data.text);
    return c.json(message, 201);
  },
});

// hook up the routes to the app instance
messageRoutes.openapi(getMessagesRoute, getMessagesRoute.handler);
messageRoutes.openapi(createMessageRoute, createMessageRoute.handler);

export default messageRoutes; 