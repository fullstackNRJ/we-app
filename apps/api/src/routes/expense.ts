import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi';
import { Context } from 'hono';
import { ExpenseService } from '../services/expenseService';
import { requireAuth } from '../utils/authMiddleware';

const expenseRoutes = new OpenAPIHono();

expenseRoutes.use('*', requireAuth());

const ExpenseSchema = z.object({
  _id: z.string(),
  user: z.string(),
  partner: z.string().optional(),
  title: z.string(),
  amount: z.number(),
  category: z.string(),
  tags: z.array(z.string()),
  shared: z.boolean(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const AddExpenseRequestSchema = z.object({
  title: z.string(),
  amount: z.number(),
  category: z.string(),
  tags: z.array(z.string()),
  shared: z.boolean(),
  addedBy: z.string(),
  date: z.string().optional(),
});

const AddExpenseResponseSchema = z.object({
  success: z.boolean(),
  expense: ExpenseSchema.optional(),
  error: z.string().optional(),
});

const ExpenseSummarySchema = z.object({
  _id: z.string(),
  total: z.number(),
  count: z.number(),
});

const GetExpensesResponseSchema = z.object({
  expenses: z.array(ExpenseSchema),
  summary: z.array(ExpenseSummarySchema),
});

const addExpenseRoute = createRoute({
  tags: ['Expense'],
  method: 'post',
  path: '/',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: AddExpenseRequestSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Add a new expense',
      content: { 'application/json': { schema: AddExpenseResponseSchema } },
    },
  },
  handler: async (c: Context) => {
    const user = c.get('user');
    const userId = user.id;
    const body = await c.req.json();
    const parse = AddExpenseRequestSchema.safeParse(body);
    if (!parse.success) {
      return c.json({ success: false, error: 'Invalid input', expense: undefined }, 200);
    }
    try {
      const expense = await ExpenseService.addExpense(userId, {
        ...parse.data,
        date: parse.data.date ? new Date(parse.data.date) : undefined,
      });
      return c.json({ success: true, expense }, 200);
    } catch (e: any) {
      return c.json({ success: false, error: e.message, expense: undefined }, 200);
    }
  },
});

const getExpensesRoute = createRoute({
  tags: ['Expense'],
  method: 'get',
  path: '/',
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      category: z.string().optional(),
      month: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: 'List expenses with breakdowns',
      content: { 'application/json': { schema: GetExpensesResponseSchema } },
    },
  },
  handler: async (c: Context) => {
    const user = c.get('user');
    const userId = user.id;
    const category = c.req.query('category');
    const month = c.req.query('month');
    const { expenses, summary } = await ExpenseService.getExpenses(userId, { category, month });
    return c.json({ expenses, summary }, 200);
  },
});

expenseRoutes.openapi(addExpenseRoute, addExpenseRoute.handler);
expenseRoutes.openapi(getExpensesRoute, getExpensesRoute.handler);

export default expenseRoutes; 