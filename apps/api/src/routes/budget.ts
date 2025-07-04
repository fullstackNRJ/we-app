import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi';
import { Context } from 'hono';
import { BudgetService } from '../services/budgetService';
import { requireAuth } from '../utils/authMiddleware';

const budgetRoutes = new OpenAPIHono();

budgetRoutes.use('*', requireAuth());

const CategorySummarySchema = z.object({
  name: z.string(),
  limit: z.number(),
  spent: z.number(),
});

const BudgetSummaryResponseSchema = z.object({
  month: z.string(),
  categories: z.array(CategorySummarySchema),
});

const AddIncomeRequestSchema = z.object({
  source: z.string(),
  amount: z.number(),
  contributor: z.string(),
});

const AddIncomeResponseSchema = z.object({
  success: z.boolean(),
  income: z.any(),
  error: z.string().optional(),
});

const CategoryRequestSchema = z.object({
  name: z.string(),
  limit: z.number(),
});

const CategoryResponseSchema = z.object({
  success: z.boolean(),
  category: z.any(),
  error: z.string().optional(),
});

const InsightsResponseSchema = z.object({
  insights: z.array(z.string()),
});

const getBudgetSummaryRoute = createRoute({
  tags: ['Budget'],
  method: 'get',
  path: '/summary',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Summarize monthly spending vs limits for each category.',
      content: { 'application/json': { schema: BudgetSummaryResponseSchema } },
    },
  },
  handler: async (c: Context) => {
    const user = c.get('user');
    const userId = user.id;
    const month = c.req.query('month') || '2025-07';
    const summary = await BudgetService.getSummary(userId, month);
    return c.json(summary, 200);
  },
});

const addIncomeRoute = createRoute({
  tags: ['Budget'],
  method: 'post',
  path: '/income',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: AddIncomeRequestSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Add income source',
      content: { 'application/json': { schema: AddIncomeResponseSchema } },
    },
  },
  handler: async (c: Context) => {
    const user = c.get('user');
    const userId = user.id;
    const month = c.req.query('month') || '2025-07';
    const body = await c.req.json();
    const parse = AddIncomeRequestSchema.safeParse(body);
    if (!parse.success) {
      return c.json({ success: false, error: 'Invalid input', income: null }, 200);
    }
    const result = await BudgetService.addIncome(userId, month, parse.data);
    return c.json(result, 200);
  },
});

const addOrEditCategoryRoute = createRoute({
  tags: ['Budget'],
  method: 'post',
  path: '/category',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: CategoryRequestSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Create/edit budget category',
      content: { 'application/json': { schema: CategoryResponseSchema } },
    },
  },
  handler: async (c: Context) => {
    const user = c.get('user');
    const userId = user.id;
    const month = c.req.query('month') || '2025-07';
    const body = await c.req.json();
    const parse = CategoryRequestSchema.safeParse(body);
    if (!parse.success) {
      return c.json({ success: false, error: 'Invalid input', category: null }, 200);
    }
    const result = await BudgetService.addOrEditCategory(userId, month, parse.data);
    return c.json(result, 200);
  },
});

const getInsightsRoute = createRoute({
  tags: ['Budget'],
  method: 'get',
  path: '/insights',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Returns insights (e.g. high spending area alerts) to light up UI visual cues.',
      content: { 'application/json': { schema: InsightsResponseSchema } },
    },
  },
  handler: async (c: Context) => {
    const user = c.get('user');
    const userId = user.id;
    const month = c.req.query('month') || '2025-07';
    const insights = await BudgetService.getInsights(userId, month);
    return c.json(insights, 200);
  },
});

budgetRoutes.openapi(getBudgetSummaryRoute, getBudgetSummaryRoute.handler);
budgetRoutes.openapi(addIncomeRoute, addIncomeRoute.handler);
budgetRoutes.openapi(addOrEditCategoryRoute, addOrEditCategoryRoute.handler);
budgetRoutes.openapi(getInsightsRoute, getInsightsRoute.handler);

export default budgetRoutes; 