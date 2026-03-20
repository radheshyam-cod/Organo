import prisma from "../utils/prisma.js";
import { Prisma } from "@prisma/client";
import { addDays } from "../utils/time.js";

const MAX_SLOTS = 6;

function computeNextDelivery(frequency: string): Date {
  const today = new Date();
  switch (frequency) {
    case "BIWEEKLY":
      return addDays(today, 14);
    case "MONTHLY":
      return addDays(today, 30);
    case "WEEKLY":
    default:
      return addDays(today, 7);
  }
}

function validateItems(items: string[]) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Subscription must include at least one product");
    (error as any).status = 400;
    throw error;
  }
  if (items.length > MAX_SLOTS) {
    const error = new Error("Subscription crate supports up to 6 products");
    (error as any).status = 400;
    throw error;
  }
}

export async function createSubscription(
  userId: string,
  items: string[],
  frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY"
) {
  validateItems(items);
  const nextDelivery = computeNextDelivery(frequency);

  return prisma.subscription.create({
    data: {
      userId,
      items: items as Prisma.InputJsonValue,
      frequency,
      nextDelivery,
      status: "ACTIVE",
    },
  });
}

export async function listSubscriptions(userId: string, isAdmin: boolean) {
  return prisma.subscription.findMany({
    where: isAdmin ? {} : { userId },
    orderBy: { nextDelivery: "asc" },
  });
}

export async function updateSubscription(
  id: string,
  userId: string,
  isAdmin: boolean,
  data: {
    status?: "ACTIVE" | "PAUSED" | "CANCELED";
    items?: string[];
    frequency?: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  }
) {
  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing) return null;
  if (!isAdmin && existing.userId !== userId) return null;

  if (data.items) validateItems(data.items);

  const nextDelivery = data.frequency ? computeNextDelivery(data.frequency) : existing.nextDelivery;

  return prisma.subscription.update({
    where: { id },
    data: {
      status: data.status ?? existing.status,
      items: (data.items ?? existing.items) as Prisma.InputJsonValue,
      frequency: data.frequency ?? existing.frequency,
      nextDelivery,
    },
  });
}

export async function deleteSubscription(id: string, userId: string, isAdmin: boolean) {
  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing) return null;
  if (!isAdmin && existing.userId !== userId) return null;
  await prisma.subscription.delete({ where: { id } });
  return existing;
}
