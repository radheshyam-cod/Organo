import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "./env.js";

type JwtPayload = {
  sub: string;
  role: string;
  email: string;
  name?: string | null;
};

export function signToken(payload: Omit<JwtPayload, "exp">): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
