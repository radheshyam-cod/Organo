import { api } from "./api";

export interface CartItemDTO {
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    image?: string;
    measurement?: string;
    tag?: string;
    price: number;
    benefits?: string[];
  };
}

export interface CartResponse {
  cart: {
    id: string;
    items: CartItemDTO[];
  } | null;
}

export const cartService = {
  async get(token: string): Promise<CartResponse> {
    const res = await api.get<CartResponse>("/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  async add(token: string, productId: string, quantity: number) {
    const res = await api.post(
      "/api/cart/add",
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
  async update(token: string, productId: string, quantity: number) {
    const res = await api.post(
      "/api/cart/update",
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
  async remove(token: string, productId: string) {
    const res = await api.post(
      "/api/cart/remove",
      { productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
};
