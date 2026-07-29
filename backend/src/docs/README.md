# API Documentation

Full interactive OpenAPI/Swagger documentation is generated automatically
from JSDoc annotations in `src/routes/*.ts` (see `src/config/swagger.ts`).

Once the server is running:

- Interactive Swagger UI: `GET /api-docs`
- Raw OpenAPI JSON: `GET /api-docs.json`

This folder is reserved for any hand-written supplementary docs (e.g.
architecture decision records, ERD exports) as the project grows.
