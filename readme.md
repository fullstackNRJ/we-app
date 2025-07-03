# We App Monorepo

This is a monorepo for the **We App** project, containing both API and client applications.

## Project Structure
we/
apps/
api/ # Node.js API server (Hono, TypeScript)
client/ # (Client app placeholder)
packages/ # (Shared packages, if any)
package.json # Monorepo root
tsconfig.json # Monorepo TypeScript config
yarn.lock


## API (`apps/api`)

- **Framework:** [Hono](https://hono.dev/) (TypeScript)
- **OpenAPI:** [@hono/zod-openapi](https://github.com/honojs/zod-openapi)
- **Features:**
  - Centralized error handling
  - CORS and logging middleware
  - OpenAPI docs and Swagger UI at `/docs`
  - Example test route at `/t`

### Getting Started

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Run the API server:**
   ```bash
   cd apps/api
   yarn start
   # or, if using ts-node:
   yarn dev
   ```

3. **API Documentation:**
   - Visit [http://localhost:8787/docs](http://localhost:8787/docs) for Swagger UI and OpenAPI JSON.

### Project Files

- `src/app.ts` — Main Hono app setup, middleware, docs, and routes.
- `src/routes/test.ts` — Example test route.
- `src/utils/error.ts` — Central error handler.
- `src/config/env.ts` — Environment config (if used).

## Development

- **TypeScript:** All code is written in TypeScript.
- **Monorepo:** Managed with Yarn workspaces.

## Scripts

From the root or `apps/api` directory, typical scripts might include:

```json
"scripts": {
  "dev": "ts-node src/index.ts",
  "start": "node dist/index.js",
  "build": "tsc"
}
```

*(Check your `package.json` for actual scripts.)*

## License

MIT (or your preferred license)

---

*Generated README based on current project files. Update as your project evolves!*