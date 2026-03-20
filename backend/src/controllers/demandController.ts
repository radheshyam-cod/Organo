import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { getDemandReport } from "../services/demandService.js";

export async function demandReportHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const report = await getDemandReport();
    res.json(report);
  } catch (error) {
    next(error);
  }
}
