import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi';
import { register, login, refreshToken, generateInviteCode } from '../services/authService';
import { requireAuth } from '../utils/authMiddleware';
import { Context } from 'hono';

const authRoutes = new OpenAPIHono();

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['admin', 'user']),
});

const RegisterRequestSchema = z.object({
  inviteCode: z.string(),
  name: z.string(),
  phone: z.string(),
  pin: z.string().min(4).max(4),
  role: z.enum(['admin', 'user']).optional(),
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

const GenerateInviteResponseSchema = z.object({ inviteCode: z.string() });

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

const generateInviteRoute = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/generate-invite',
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'Invite code generated', content: { 'application/json': { schema: GenerateInviteResponseSchema } } },
    403: { description: 'Forbidden', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
  handler: async (c: Context) => {
    // Manually check auth and role
    const authHeader = c.req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = require('../utils/jwt').verifyAccessToken(token) as { id: string; name: string; role?: string };
      if (!payload.role || payload.role !== 'admin') {
        return c.json({ error: 'Forbidden' }, 403);
      }
      const inviteCode = await generateInviteCode();
      return c.json({ inviteCode: inviteCode || '' }, 200);
    } catch (e) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
  },
});

authRoutes.openapi(registerRoute, registerRoute.handler);
authRoutes.openapi(loginRoute, loginRoute.handler);
authRoutes.openapi(refreshTokenRoute, refreshTokenRoute.handler);
authRoutes.openapi(generateInviteRoute, generateInviteRoute.handler);

export default authRoutes; 