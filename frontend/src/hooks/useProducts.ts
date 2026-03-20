import { useEffect, useState } from "react";
import { productService } from "../services/productService";

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
  priceTier?: "budget" | "premium";
  harvestDate?: string | Date;
  farmerName?: string;
  origin?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productService.list();
        const mapped = (res as Product[]).map((p) => ({
          ...p,
          priceTier: (Number(p.price) <= 249 ? "budget" : "premium") as "budget" | "premium",
        }));
        setProducts(mapped);
      } catch (err: any) {
        const message = err?.message?.includes("Network")
          ? "Cannot reach API. Make sure the backend is running on VITE_API_BASE."
          : (err?.response?.data?.message ?? "Failed to load products");
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const getById = (id: string) => products.find((p) => p.id === id);

  return { products, loading, error, getById };
}
