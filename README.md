# storefront

React checkout UI for the Oxyhydrocar e-commerce platform.

## Connected Services

| Service | How it connects | Risk |
|---|---|---|
| **orders-service** | `GET /orders/:id` to load order details | Response shape changes break the UI |
| **orders-service** | `POST /orders` to create new orders | Request/response contract changes silently corrupt state |
| **payments-service** | `POST /payments/initiate` to start payment | Any error in payments-service surfaces as "Payment failed" with no detail |

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

The frontend has **no type-safety boundary** with either backend.
It casts `response.json()` directly to its local `Order` type,
which has been out of sync with orders-service since September 2024.

## Known Cross-Repo Drift (open bugs)

> All unit tests pass in every repo. These bugs only appear at runtime.

| # | Root cause in orders-service | Stale assumption here | Symptom |
|---|---|---|---|
| [#3](../../issues/3) | Field `total` renamed to `totalAmount` | `order.total` in `OrderSummary.tsx` | **Checkout total shows "$NaN"** |
| [#4](../../issues/4) | Field `userId` renamed to `customerId` | `order.userId` in `OrderSummary.tsx` | **Customer name shows "Unknown"** |
| [#5](../../issues/5) | Status enum values uppercased | `STATUS_LABELS` map uses lowercase keys | **Status always shows "Unknown status (PAYMENT_PENDING)"** |
| [#6](../../issues/6) | payments-service queries wrong DB column | `/payments/initiate` always 404s | **"Pay Now" always fails with "Order not found"** |

## Running locally

```bash
cp .env.example .env
npm install
npm run dev
# open http://localhost:5173
```

Make sure both `orders-service` (port 3001) and `payments-service` (port 3002) are running.
