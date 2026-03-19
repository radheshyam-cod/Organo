import type { NextFunction, Request, Response } from "express";

interface HttpError extends Error {
  status?: number;
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.status ?? 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ message });
}
