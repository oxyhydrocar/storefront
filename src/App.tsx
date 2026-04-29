import React, { useEffect, useState } from "react";

interface Order {
  id: string;
  userId: string;
  total: number;
  status: "pending" | "paid" | "cancelled";
  items: Array<{ productId: string; name: string; quantity: number; unitPrice: number }>;
}

async function fetchOrder(orderId: string): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}`);
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

async function createOrder(userId: string, items: Order["items"]): Promise<{ orderId: string }> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, items }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export default function App() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrder("a1b2c3d4-0000-0000-0000-000000000001").then(setOrder).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Checkout</h1>
      {order ? (
        <div>
          <p>Order ID: {order.id}</p>
          <p>Customer: {order.userId}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
          <p>Status: {order.status}</p>
        </div>
      ) : (
        <p>Loading order...</p>
      )}
    </div>
  );
}
