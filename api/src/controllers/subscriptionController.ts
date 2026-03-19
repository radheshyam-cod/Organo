import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import {
  createSubscription,
  deleteSubscription,
  listSubscriptions,
  updateSubscription,
} from "../services/subscriptionService.js";

export async function createSubscriptionHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { items, frequency } = req.body;
    const sub = await createSubscription(
      req.user.id,
      Array.isArray(items) ? items : [],
      (frequency as "WEEKLY" | "BIWEEKLY" | "MONTHLY") ?? "WEEKLY"
    );
    res.status(201).json({ subscription: sub });
  } catch (error) {
    next(error);
  }
}

export async function listSubscriptionsHandler(
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
    const subs = await listSubscriptions(req.user.id, isAdmin);
    res.json({ subscriptions: subs });
  } catch (error) {
    next(error);
  }
}

export async function updateSubscriptionHandler(
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
    const payload = {
      status: req.body.status as "ACTIVE" | "PAUSED" | "CANCELED" | undefined,
      items: req.body.items as string[] | undefined,
      frequency: req.body.frequency as "WEEKLY" | "BIWEEKLY" | "MONTHLY" | undefined,
    };
    const updated = await updateSubscription(id, req.user.id, isAdmin, payload);
    if (!updated) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }
    res.json({ subscription: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteSubscriptionHandler(
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
    const removed = await deleteSubscription(id, req.user.id, isAdmin);
    if (!removed) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
