import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { signToken } from "../utils/jwt.js";
import type { Role } from "@prisma/client";

const SALT_ROUNDS = 10;

export async function signup(params: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) {
  const { name, email, password, role } = params;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error("Email already registered");
    (error as any).status = 409;
    throw error;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role ?? "CUSTOMER",
    },
  });

  const token = signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  return { user, token };
}

export async function login(params: { email: string; password: string }) {
  const { email, password } = params;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("Invalid credentials");
    (error as any).status = 401;
    throw error;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const error = new Error("Invalid credentials");
    (error as any).status = 401;
    throw error;
  }

  const token = signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  return { user, token };
}
