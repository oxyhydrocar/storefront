import React from "react";
import { Order } from "../types/shared";

interface Props {
  order: Order;
}

/**
 * Displays order details on the checkout page.
 *
 * BUG: order.total will always be `undefined` at runtime because
 * orders-service returns { totalAmount } not { total }.
 * The UI renders "$NaN" or "$0.00" depending on how formatCurrency handles undefined.
 *
 * This passes TypeScript compilation because storefront's shared.ts
 * still defines Order.total — the type is stale, not the component.
 */
export function OrderSummary({ order }: Props) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  // order.total is typed as `number` here, but at runtime it's `undefined`
  // because the API actually returns `totalAmount`. Result: "$NaN" displayed.
  const displayTotal = formatCurrency(order.total);

  // order.status is typed as "pending" | "paid" | ... but orders-service
  // now returns "AWAITING_PAYMENT" | "PAYMENT_PENDING" | "PAID" ...
  // The status label lookup below returns undefined for any current status.
  const STATUS_LABELS: Record<string, string> = {
    pending: "Pending",
    paid: "Paid",
    cancelled: "Cancelled",
    refunded: "Refunded",
    // Missing: AWAITING_PAYMENT, PAYMENT_PENDING, PAID, FULFILLING, SHIPPED, DELIVERED
  };

  return (
    <div className="order-summary">
      <h2>Order #{order.id.slice(0, 8)}</h2>

      {/* Renders "undefined" because order.userId is undefined at runtime */}
      <p className="customer">Customer: {order.userId ?? "Unknown"}</p>

      <ul>
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.name} × {item.quantity} — {formatCurrency(item.unitPrice * item.quantity)}
          </li>
        ))}
      </ul>

      {/* BUG: always "$NaN" — order.total is undefined, should be order.totalAmount */}
      <p className="total">
        <strong>Total: {displayTotal}</strong>
      </p>

      {/* BUG: always "Unknown status" — status values changed in orders-service */}
      <p className="status">
        Status: {STATUS_LABELS[order.status] ?? `Unknown status (${order.status})`}
      </p>
    </div>
  );
}
