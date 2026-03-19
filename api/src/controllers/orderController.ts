import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { createOrderFromCart, getOrderById, listOrders } from "../services/orderService.js";

export async function createOrderHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { businessName, gstin } = req.body as { businessName?: string; gstin?: string };
    const order = await createOrderFromCart(req.user.id, { businessName, gstin });
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
}

export async function listOrdersHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const isAdmin = req.user.role === "ADMIN";
    const orders = await listOrders(req.user.id, isAdmin);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

export async function getOrderHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const isAdmin = req.user.role === "ADMIN";
    const order = await getOrderById(id, req.user.id, isAdmin);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json({ order });
  } catch (error) {
    next(error);
  }
}
