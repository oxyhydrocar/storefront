export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
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

export interface InitiatePaymentRequest {
  orderId: string;
  paymentMethod: "card" | "paypal";
}

export interface InitiatePaymentResponse {
  paymentId: string;
  status: "processing" | "failed";
}
