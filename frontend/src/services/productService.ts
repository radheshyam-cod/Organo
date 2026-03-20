import { PRODUCTS } from "../data/products";

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
    return [...PRODUCTS.juices, ...PRODUCTS.vegetables, ...PRODUCTS.fruits].map((p) => ({
      ...p,
      id: p.id.toString(),
    }));
  },
  async get(id: string): Promise<Product> {
    const allProducts = [...PRODUCTS.juices, ...PRODUCTS.vegetables, ...PRODUCTS.fruits];
    const found = allProducts.find((p) => p.id.toString() === id);
    if (!found) throw new Error("Product not found");
    return { ...found, id: found.id.toString() };
  },
};
