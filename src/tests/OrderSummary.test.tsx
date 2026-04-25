/**
 * Storefront unit tests.
 *
 * These tests pass because they use mock data that matches the
 * STALE Order type (with `total` and `userId`).
 * They never see real API responses, so the field name drift is invisible.
 */
import { Order } from "../types/shared";

describe("OrderSummary data shaping", () => {
  it("formats total as currency", () => {
    // This test uses { total: 149.99 } — our stale type.
    // The real API returns { totalAmount: 149.99 } — never tested here.
    const order: Order = {
      id: "abc-123",
      userId: "user-1",
      total: 149.99,         // ← stale field; API actually sends totalAmount
      status: "pending",     // ← stale value; API actually sends AWAITING_PAYMENT
      items: [
        { productId: "p1", name: "Widget", quantity: 2, unitPrice: 74.99 },
      ],
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    };

    const fmt = (n: number) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

    // Passes — but in production order.total is undefined, so this returns "$NaN"
    expect(fmt(order.total)).toBe("$149.99");
  });

  it("known status values render a label", () => {
    const STATUS_LABELS: Record<string, string> = {
      pending: "Pending",
      paid: "Paid",
      cancelled: "Cancelled",
    };

    // Passes with mock data. Real API sends "AWAITING_PAYMENT" which returns undefined.
    expect(STATUS_LABELS["pending"]).toBe("Pending");
    expect(STATUS_LABELS["AWAITING_PAYMENT"]).toBeUndefined(); // ← real value, no label
  });
});
