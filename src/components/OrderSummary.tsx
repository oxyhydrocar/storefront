import React from "react";
import { Order } from "../types/shared";

interface Props {
  order: Order;
}

export function OrderSummary({ order }: Props) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const displayTotal = formatCurrency(order.total);

  const STATUS_LABELS: Record<string, string> = {
    pending: "Pending",
    paid: "Paid",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };

  return (
    <div className="order-summary">
      <h2>Order #{order.id.slice(0, 8)}</h2>
      <p className="customer">Customer: {order.userId ?? "Unknown"}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.name} × {item.quantity} — {formatCurrency(item.unitPrice * item.quantity)}
          </li>
        ))}
      </ul>
      <p className="total">
        <strong>Total: {displayTotal}</strong>
      </p>
      <p className="status">
        Status: {STATUS_LABELS[order.status] ?? `Unknown status (${order.status})`}
      </p>
    </div>
  );
}
