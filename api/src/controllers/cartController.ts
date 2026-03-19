import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../services/cartService.js";

export async function getCartHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const cart = await getCart(req.user.id);
    res.json({ cart });
  } catch (error) {
    next(error);
  }
}

export async function addToCartHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { productId, quantity } = req.body;
    if (!productId || typeof quantity !== "number") {
      res.status(400).json({ message: "productId and quantity are required" });
      return;
    }
    const item = await addToCart(req.user.id, productId, quantity);
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
}

export async function removeFromCartHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ message: "productId is required" });
      return;
    }
    const cart = await removeFromCart(req.user.id, productId);
    res.json({ cart });
  } catch (error) {
    next(error);
  }
}

export async function updateCartHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { productId, quantity } = req.body;
    if (!productId || typeof quantity !== "number") {
      res.status(400).json({ message: "productId and quantity are required" });
      return;
    }
    const item = await updateCartItem(req.user.id, productId, quantity);
    res.json({ item });
  } catch (error) {
    next(error);
  }
}
