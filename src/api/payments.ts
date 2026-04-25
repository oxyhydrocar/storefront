import { InitiatePaymentRequest, InitiatePaymentResponse } from "../types/shared";

const PAYMENTS_API = import.meta.env.VITE_PAYMENTS_API_URL || "http://localhost:3002";

export async function initiatePayment(
  req: InitiatePaymentRequest
): Promise<InitiatePaymentResponse> {
  const res = await fetch(`${PAYMENTS_API}/payments/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  // payments-service always returns 404 here (because it queries the wrong
  // column name in the DB). The error propagates to the user as a generic
  // "Payment failed" message with no useful debug info.
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Payment initiation failed (${res.status})`);
  }

  return res.json();
}
