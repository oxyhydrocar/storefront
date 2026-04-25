import { Order } from "../types/shared";

const ORDERS_API = import.meta.env.VITE_ORDERS_API_URL || "http://localhost:3001";

export async function fetchOrder(orderId: string): Promise<Order> {
  const res = await fetch(`${ORDERS_API}/orders/${orderId}`);
  if (!res.ok) throw new Error(`Failed to fetch order ${orderId}`);
  return res.json() as Promise<Order>;
}

export async function createOrder(payload: {
  customerId: string;
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
