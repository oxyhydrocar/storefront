import { Order } from "../types/shared";

describe("OrderSummary data shaping", () => {
  it("formats total as currency", () => {
    const order: Order = {
      id: "abc-123",
      userId: "user-1",
      total: 149.99,
      status: "pending",
      items: [
        { productId: "p1", name: "Widget", quantity: 2, unitPrice: 74.99 },
      ],
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    };

    const fmt = (n: number) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

    expect(fmt(order.total)).toBe("$149.99");
  });

  it("known status values render a label", () => {
    const STATUS_LABELS: Record<string, string> = {
      pending: "Pending",
      paid: "Paid",
      cancelled: "Cancelled",
    };

    expect(STATUS_LABELS["pending"]).toBe("Pending");
  });
});
