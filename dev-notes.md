## developer notes
- A collection of challenges, tips, tricks and steps followed to setup this repo.

[3/7/25]
- added hono with mongoose and openAPI
- to create a new route which openAPI spec compatible, we need to use OpenAPIHono instead of just hono
- we would create new routes inside route directory and use createRoute to define api endpoints, wrap them or hook them up to sub route app instance and finally pass it to main app instance