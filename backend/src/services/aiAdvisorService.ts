import prisma from "../utils/prisma.js";
import { Prisma } from "@prisma/client";

type Goal = "energy" | "detox" | "recovery";
type TimeOfDay = "morning" | "afternoon" | "evening";

const GOAL_TAGS: Record<Goal, string[]> = {
  energy: ["Energy", "Kick", "Stamina", "Vitamin C"],
  detox: ["Detox", "Cleanse", "Balance"],
  recovery: ["Recovery", "Protein", "Hydrate"],
};

const PREF_TAGS: Record<string, string[]> = {
  "low sugar": ["Low Sugar", "Keto", "Balance"],
  "high protein": ["Protein"],
  hydration: ["Hydrate", "Refresh"],
};

const TIME_TAGS: Record<TimeOfDay, string[]> = {
  morning: ["Energy", "Vitamin C"],
  afternoon: ["Hydrate", "Refresh"],
  evening: ["Calm", "Recovery", "Balance"],
};

function normalize(text: string) {
  return text.toLowerCase();
}

function computeScore(product: any, goal: Goal, timeOfDay: TimeOfDay, preferences: string[]) {
  let score = 0;
  const tags = product.tags?.map(normalize) ?? [];
  const benefits = product.benefits?.map(normalize) ?? [];

  const goalTags = GOAL_TAGS[goal].map(normalize);
  const timeTags = TIME_TAGS[timeOfDay].map(normalize);

  score += tags.filter((t: string) => goalTags.includes(t)).length * 3;
  score += benefits.filter((b: string) => goalTags.includes(b)).length * 2;
  score += tags.filter((t: string) => timeTags.includes(t)).length * 2;

  for (const pref of preferences) {
    const prefTags = PREF_TAGS[pref.toLowerCase()] ?? [];
    const normalizedPref = prefTags.map(normalize);
    score += tags.filter((t: string) => normalizedPref.includes(t)).length * 2;
    score += benefits.filter((b: string) => normalizedPref.includes(b)).length * 2;
  }

  // Reward stock availability
  if (product.stock > 0) score += 1;

  return score;
}

function pickTopDistinct(
  products: any[],
  goal: Goal,
  timeOfDay: TimeOfDay,
  preferences: string[],
  count: number
) {
  const scored = products
    .map((p) => ({ product: p, score: computeScore(p, goal, timeOfDay, preferences) }))
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
  return scored.slice(0, count).map((s) => s.product);
}

export async function generateRecommendation(
  userId: string,
  goal: Goal,
  timeOfDay: TimeOfDay,
  preferences: string[]
) {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
  });

  if (products.length === 0) {
    const error = new Error("No products available for recommendation");
    (error as any).status = 400;
    throw error;
  }

  const morningPick = pickTopDistinct(products, goal, "morning", preferences, 1)[0] ?? products[0];
  const afternoonPick =
    pickTopDistinct(products, goal, "afternoon", preferences, 1)[0] ?? products[0];
  const eveningPick = pickTopDistinct(products, goal, "evening", preferences, 1)[0] ?? products[0];

  const recommendation = {
    goal,
    timeOfDay,
    preferences,
    schedule: {
      morning: { productId: morningPick.id, name: morningPick.name },
      afternoon: { productId: afternoonPick.id, name: afternoonPick.name },
      evening: { productId: eveningPick.id, name: eveningPick.name },
    },
    reasoning: {
      goalAlignment: GOAL_TAGS[goal],
      preferenceAlignment: preferences,
      deterministic: true,
    },
  };

  const record = await prisma.aIRecommendation.create({
    data: {
      userId,
      goal: goal.toUpperCase() as any,
      timeOfDay,
      preferences: preferences as Prisma.InputJsonValue,
      recommendation: recommendation as Prisma.InputJsonValue,
    },
  });

  return { recommendation, recordId: record.id };
}
