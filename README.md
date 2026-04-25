# storefront

React checkout UI for the Oxyhydrocar e-commerce platform.

## Related Services

- **orders-service** — provides order data via REST API
- **payments-service** — processes payments

## Architecture

```
 User's browser
      │
      ├─── GET /orders/:id  ────────────────→  orders-service  (port 3001)
      │                                               │
      │                                               └── PostgreSQL (shared DB)
      │                                                        ↑
      └─── POST /payments/initiate  ────────→  payments-service (port 3002)
                                                       │
                                                       └── PostgreSQL (same shared DB)
```

## Running locally

```bash
cp .env.example .env
npm install
npm run dev
# open http://localhost:5173
```

Make sure both `orders-service` (port 3001) and `payments-service` (port 3002) are running.
