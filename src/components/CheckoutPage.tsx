import React, { useEffect, useState } from "react";
import { Order } from "../types/shared";
import { fetchOrder } from "../api/orders";
import { initiatePayment } from "../api/payments";
import { OrderSummary } from "./OrderSummary";

interface Props {
  orderId: string;
}

export function CheckoutPage({ orderId }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOrder(orderId)
      .then(setOrder)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePay = async (method: "card" | "paypal") => {
    setPaying(true);
    setError(null);
    try {
      await initiatePayment({ orderId, paymentMethod: method });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="checkout">
      <OrderSummary order={order} />
      {success ? (
        <p className="success">Payment initiated successfully!</p>
      ) : (
        <div className="payment-options">
          <h3>Pay with:</h3>
          <button onClick={() => handlePay("card")} disabled={paying}>
            {paying ? "Processing..." : "Credit / Debit Card"}
          </button>
          <button onClick={() => handlePay("paypal")} disabled={paying}>
            PayPal
          </button>
          {error && <p className="error">Payment failed: {error}</p>}
        </div>
      )}
    </div>
  );
}
