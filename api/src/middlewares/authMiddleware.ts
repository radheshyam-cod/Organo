import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

export type AuthUser = {
  id: string;
  role: string;
  email: string;
  name?: string | null;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
}
