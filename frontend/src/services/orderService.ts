import { api } from "./api";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  subtotal: number;
  gstAmount: number;
  deliveryFee: number;
  totalAmount: number;
  gstRate: number;
  status: string;
  deliveryETA: string;
  invoiceNumber: string;
  businessName?: string | null;
  gstin?: string | null;
  items: OrderItem[];
}

export const orderService = {
  async list(token: string): Promise<{ orders: Order[] }> {
    const res = await api.get<{ orders: Order[] }>("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  async create(token: string): Promise<{ order: Order }> {
    const res = await api.post<{ order: Order }>(
      "/api/orders/create",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
  async get(token: string, id: string): Promise<{ order: Order }> {
    const res = await api.get<{ order: Order }>(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
