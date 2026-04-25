import { Order } from "../types/shared";

const ORDERS_API = import.meta.env.VITE_ORDERS_API_URL || "http://localhost:3001";

export async function fetchOrder(orderId: string): Promise<Order> {
  const res = await fetch(`${ORDERS_API}/orders/${orderId}`);
  if (!res.ok) throw new Error(`Failed to fetch order ${orderId}`);

  // The API returns: { id, customerId, totalAmount, status, items, ... }
  // Our Order type expects:  { id, userId,      total,       status, items, ... }
  //
  // We cast the response directly — TypeScript can't help us here because
  // the type definition is stale. At runtime:
  //   order.total     → undefined  (field is named totalAmount in the response)
  //   order.userId    → undefined  (field is named customerId in the response)
  return res.json() as Promise<Order>;
}

export async function createOrder(payload: {
  customerId: string;  // ← note: we DO send the right field name to orders-service
  items: Array<{ productId: string; name: string; quantity: number; unitPrice: number }>;
}): Promise<{ orderId: string; status: string }> {
  const res = await fetch(`${ORDERS_API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}
