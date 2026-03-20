import { api } from "./api";

export interface CreatePaymentResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number; // paise
  currency: string;
  key: string;
}

export const paymentService = {
  async createOrder(token: string, orderId?: string): Promise<CreatePaymentResponse> {
    const res = await api.post<CreatePaymentResponse>(
      "/api/payment/create-order",
      { orderId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
  async verify(
    token: string,
    payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
  ): Promise<{ message: string; orderId: string; paymentId: string }> {
    const res = await api.post<{ message: string; orderId: string; paymentId: string }>(
      "/api/payment/verify",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
};
