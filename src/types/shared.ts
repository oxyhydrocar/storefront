/**
 * Shared contract types — storefront copy
 *
 * ⚠️  WARNING: This file is duplicated across services:
 *   - orders-service/src/types/shared.ts   (source of truth — last synced: 2024-09-22)
 *   - payments-service/src/types/shared.ts  (copy — last synced: 2024-11-10)
 *   - storefront/src/types/shared.ts        ← YOU ARE HERE (last synced: 2024-09-22)
 *
 * This is the MOST OUT OF DATE copy — synced before either service's breaking changes.
 */

// ─── Order Status ────────────────────────────────────────────────────────────
// STALE: This is the original enum from before any migrations.
// orders-service now uses uppercase multi-word values.
export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

// ─── Order ───────────────────────────────────────────────────────────────────
// STALE: Multiple field renames have happened since this was synced.
export interface Order {
  id: string;
  userId: string;    // ← renamed to customerId in orders-service (2024-12-01)
  items: OrderItem[];
  total: number;     // ← renamed to totalAmount in orders-service (2025-02-10)
                     //   API returns { totalAmount: 149.99 }
                     //   storefront reads order.total → undefined → displays "NaN" or "$0.00"
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

// ─── Payment ─────────────────────────────────────────────────────────────────
export interface InitiatePaymentRequest {
  orderId: string;
  paymentMethod: "card" | "paypal";
}

export interface InitiatePaymentResponse {
  paymentId: string;
  status: "processing" | "failed";
}
