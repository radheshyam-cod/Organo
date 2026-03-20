import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { createPaymentOrder, verifyPayment } from "../services/paymentService.js";

export async function createPaymentOrderHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { orderId } = req.body as { orderId?: string };
    const paymentOrder = await createPaymentOrder({ userId: req.user.id, orderId });
    res.status(201).json(paymentOrder);
  } catch (error) {
    next(error);
  }
}

export async function verifyPaymentHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    const result = await verifyPayment(req.user.id, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.json({ message: "Payment verified", ...result });
  } catch (error) {
    next(error);
  }
}
