import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi';
import { register, login, refreshToken } from '../services/authService';
import { Context } from 'hono';

const authRoutes = new OpenAPIHono();

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const RegisterRequestSchema = z.object({
  inviteCode: z.string(),
  name: z.string(),
  phone: z.string(),
  pin: z.string().min(4).max(4),
});

const LoginRequestSchema = z.object({
  phone: z.string(),
  pin: z.string().min(4).max(4),
});

const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSchema,
});

const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});

const ErrorResponseSchema = z.object({ error: z.string() });

const registerRoute = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/register',
  request: {
    body: {
      content: {
        'application/json': { schema: RegisterRequestSchema },
      },
      required: true,
    },
  },
  responses: {
    200: { description: 'Registration successful', content: { 'application/json': { schema: TokenResponseSchema } } },
    400: { description: 'Invalid input', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
  handler: async (c: Context) => {
    const body = await c.req.json();
    const parse = RegisterRequestSchema.safeParse(body);
    if (!parse.success) {
      return c.json({ error: 'Invalid input' }, 400);
    }
    try {
      const result = await register(parse.data);
      return c.json(result, 200);
    } catch (e: any) {
      return c.json({ error: e.message }, 400);
    }
  },
});

const loginRoute = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': { schema: LoginRequestSchema },
      },
      required: true,
    },
  },
  responses: {
    200: { description: 'Login successful', content: { 'application/json': { schema: TokenResponseSchema } } },
    400: { description: 'Invalid credentials', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
  handler: async (c: Context) => {
    const body = await c.req.json();
    const parse = LoginRequestSchema.safeParse(body);
    if (!parse.success) {
      return c.json({ error: 'Invalid input' }, 400);
    }
    try {
      const result = await login(parse.data);
      return c.json(result, 200);
    } catch (e: any) {
      return c.json({ error: e.message }, 400);
    }
  },
});

const refreshTokenRoute = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/refresh-token',
  request: {
    body: {
      content: {
        'application/json': { schema: RefreshTokenRequestSchema },
      },
      required: true,
    },
  },
  responses: {
    200: { description: 'Token refreshed', content: { 'application/json': { schema: RefreshTokenResponseSchema } } },
    400: { description: 'Invalid refresh token', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
  handler: async (c: Context) => {
    const body = await c.req.json();
    const parse = RefreshTokenRequestSchema.safeParse(body);
    if (!parse.success) {
      return c.json({ error: 'Invalid input' }, 400);
    }
    try {
      const result = await refreshToken({ refreshToken: parse.data.refreshToken });
      return c.json(result, 200);
    } catch (e: any) {
      return c.json({ error: e.message }, 400);
    }
  },
});

authRoutes.openapi(registerRoute, registerRoute.handler);
authRoutes.openapi(loginRoute, loginRoute.handler);
authRoutes.openapi(refreshTokenRoute, refreshTokenRoute.handler);

export default authRoutes; 