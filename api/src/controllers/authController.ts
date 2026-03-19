import type { Request, Response, NextFunction } from "express";
import { login, signup } from "../services/authService.js";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

export async function handleSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "name, email, and password are required" });
      return;
    }
    const result = await signup({ name, email, password, role });
    res.status(201).json({
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }
    const result = await login({ email, password });
    res.status(200).json({
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function handleMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  res.status(200).json({ user: req.user });
}
