import type { Request, Response, NextFunction } from "express";
import { listProducts, getProductById } from "../services/productService.js";

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, tags, benefits } = req.query;
    const parsedTags =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined;
    const parsedBenefits =
      typeof benefits === "string"
        ? benefits
            .split(",")
            .map((b) => b.trim())
            .filter(Boolean)
        : undefined;

    const products = await listProducts({
      category: typeof category === "string" ? category : undefined,
      tags: parsedTags,
      benefits: parsedBenefits,
    });
    res.json({ products });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ product });
  } catch (error) {
    next(error);
  }
}
