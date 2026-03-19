import type { Request, Response, NextFunction } from "express";
import { getHealthStatus } from "../services/healthService.js";

export async function healthCheck(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = await getHealthStatus();
    res.status(status.status === "ok" ? 200 : 503).json(status);
  } catch (error) {
    next(error);
  }
}
