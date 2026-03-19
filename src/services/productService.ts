import { api } from "./api";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  tag?: string;
  benefits?: string[];
  ingredients?: string[];
  measurement?: string;
  description?: string;
}

export const productService = {
  async list(): Promise<Product[]> {
    const res = await api.get<{ products: Product[] }>("/api/products");
    return res.data.products;
  },
  async get(id: string): Promise<Product> {
    const res = await api.get<{ product: Product }>(`/api/products/${id}`);
    return res.data.product;
  },
};
