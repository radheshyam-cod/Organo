import type { Request, Response, NextFunction } from "express";
import { checkPincode } from "../services/deliveryService.js";

export async function checkDelivery(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { pincode } = req.query;
    if (typeof pincode !== "string" || !/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      res.status(400).json({ message: "Valid 6-digit pincode is required" });
      return;
    }
    const result = await checkPincode(pincode.trim());
    res.json(result);
  } catch (error) {
    next(error);
  }
}
