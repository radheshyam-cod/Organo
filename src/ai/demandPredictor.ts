import { PRODUCTS } from "../data/products";

export interface DemandEntry {
  juiceId: number;
  juiceName: string;
  tag: string;
  demandScore: number; // 0 – 100
  level: "high" | "medium" | "low";
  trend: "up" | "stable" | "down";
  weekOverWeekChange?: number;
  inventoryDays?: number;
}

export interface WasteRisk {
  juiceId: number;
  juiceName: string;
  recommendation: string;
  riskLevel: "critical" | "warning" | "monitor";
}

export interface SourcingItem {
  ingredient: string;
  juices: string[];
  priority: "critical" | "high" | "medium";
  estimatedQuantity?: string;
}

export interface PriceOptimization {
  juiceId: number;
  juiceName: string;
  currentPrice: number;
  suggestedPrice: number;
  elasticity: number; // -0.5 to -2.0
  rationale: string;
}

export interface DemandReport {
  entries: DemandEntry[];
  wasteRisk: WasteRisk[];
  sourcingList: SourcingItem[];
  priceOptimizations: PriceOptimization[];
  weekLabel: string;
  insights: string[];
}

// Seed demand scores per tag (simulating ML model output)
const TAG_BASE_SCORES: Record<string, number> = {
  Immunity: 88,
  Energy: 82,
  Detox: 76,
  Antioxidant: 74,
  Hydrate: 70,
  Stamina: 68,
  Glow: 65,
  "Vitamin C": 72,
  Brain: 60,
  Cleanse: 55,
  Calm: 50,
  Balance: 52,
  Refresh: 66,
  Keto: 48,
  Kick: 78,
  Protein: 57,
  Zest: 45,
  Vibrant: 63,
};

function readCartHistory(): Record<number, number> {
  try {
    const raw = localStorage.getItem("organo_cart_history");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getLevel(score: number): "high" | "medium" | "low" {
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function getTrend(score: number): "up" | "stable" | "down" {
  if (score >= 70) return "up";
  if (score >= 50) return "stable";
  return "down";
}

function getWeekLabel(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function generateDemandReport(): DemandReport {
  const cartHistory = readCartHistory();

  // Calculate week-over-week change (simulated)
  const getWeekOverWeekChange = (juice: string): number => {
    const hash = juice.charCodeAt(0) * 7;
    return Math.round(Math.sin(hash) * 20); // -20% to +20%
  };

  const entries: DemandEntry[] = PRODUCTS.juices.map((juice) => {
    const base = TAG_BASE_SCORES[juice.tag] ?? 55;
    // Boost by cart activity
    const boost = (cartHistory[juice.id] ?? 0) * 3;
    const noise = Math.sin(juice.id * 7.3) * 8; // deterministic noise per juice
    const score = Math.min(100, Math.max(10, Math.round(base + boost + noise)));

    // Estimate inventory days based on demand
    const dailyConsumption = score / 15; // rough estimate
    const inventoryDays = Math.round(45 / Math.max(0.5, dailyConsumption)); // assume 45-unit stock

    return {
      juiceId: juice.id,
      juiceName: juice.name,
      tag: juice.tag,
      demandScore: score,
      level: getLevel(score),
      trend: getTrend(score),
      weekOverWeekChange: getWeekOverWeekChange(juice.name),
      inventoryDays,
    };
  });

  // Sort descending
  entries.sort((a, b) => b.demandScore - a.demandScore);

  // Waste risk — bottom items with low turnover
  const wasteRisk: WasteRisk[] = entries
    .filter((e) => e.level === "low")
    .slice(0, 5)
    .map((e) => ({
      juiceId: e.juiceId,
      juiceName: e.juiceName,
      riskLevel: e.demandScore < 20 ? "critical" : e.demandScore < 35 ? "warning" : "monitor",
      recommendation:
        e.demandScore < 20
          ? `CRITICAL: Consider discontinuing or heavily promoting. Stock only covers ${e.inventoryDays} days.`
          : `Reduce batch size by 30-40% or bundle with high-demand juices.`,
    }));

  // Sourcing priority — top ingredients from high-demand juices
  const highDemandJuices = entries
    .filter((e) => e.level === "high")
    .map((e) => PRODUCTS.juices.find((j) => j.id === e.juiceId)!)
    .filter(Boolean);

  const ingredientMap: Record<string, { juices: string[]; count: number }> = {};
  highDemandJuices.forEach((juice) => {
    juice.ingredients.forEach((ing) => {
      if (!ingredientMap[ing]) ingredientMap[ing] = { juices: [], count: 0 };
      ingredientMap[ing].juices.push(juice.name);
      ingredientMap[ing].count++;
    });
  });

  const sourcingList: SourcingItem[] = Object.entries(ingredientMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8)
    .map(([ingredient, data], idx) => ({
      ingredient,
      juices: Array.from(new Set(data.juices)),
      priority: idx < 3 ? "critical" : idx < 6 ? "high" : "medium",
      estimatedQuantity: idx < 3 ? "500+ kg/week" : idx < 6 ? "200-300 kg/week" : "100-150 kg/week",
    }));

  // Price optimization suggestions
  const priceOptimizations: PriceOptimization[] = entries
    .filter((e) => e.level === "high")
    .slice(0, 4)
    .map((entry) => {
      const juice = PRODUCTS.juices.find((j) => j.id === entry.juiceId)!;
      const demandElasticity = -1.2; // standard elasticity
      const priceIncrease = (entry.demandScore - 70) * 0.015; // 0-2% increase for highest demand
      const suggestedPrice = Math.round(juice.price * (1 + priceIncrease) * 100) / 100;

      return {
        juiceId: entry.juiceId,
        juiceName: entry.juiceName,
        currentPrice: juice.price,
        suggestedPrice,
        elasticity: demandElasticity,
        rationale: `High demand (${entry.demandScore}/100) + ${entry.weekOverWeekChange}% growth = optimize pricing`,
      };
    });

  // Generate insights
  const getInsights = (): string[] => {
    const insights: string[] = [];
    const highDemandCount = entries.filter((e) => e.level === "high").length;
    const growingJuices = entries.filter(
      (e) => e.weekOverWeekChange && e.weekOverWeekChange > 10
    ).length;
    const declining = entries.filter(
      (e) => e.weekOverWeekChange && e.weekOverWeekChange < -10
    ).length;

    insights.push(`🔝 Top performers: ${highDemandCount} juices in high-demand tier`);

    if (growingJuices > 0) {
      insights.push(`📈 Growth opportunity: ${growingJuices} juices growing 10%+ week-over-week`);
    }

    if (declining > 0) {
      insights.push(
        `⚠️  Watch list: ${declining} juices declining — consider promotions or bundling`
      );
    }

    const averageDemand = Math.round(
      entries.reduce((sum, e) => sum + e.demandScore, 0) / entries.length
    );
    insights.push(
      `📊 Average demand: ${averageDemand}/100 — portfolio is ${averageDemand > 60 ? "strong" : "needs attention"}`
    );

    return insights;
  };

  return {
    entries,
    wasteRisk,
    sourcingList,
    priceOptimizations,
    weekLabel: getWeekLabel(),
    insights: getInsights(),
  };
}

/**
 * Get inventory optimization recommendations to minimize waste
 */
export function getInventoryOptimizations(): Array<{
  item: string;
  current: string;
  recommended: string;
  rationale: string;
}> {
  const report = generateDemandReport();
  const optimizations: Array<{
    item: string;
    current: string;
    recommended: string;
    rationale: string;
  }> = [];

  // Over-stocked items
  const overStocked = report.entries.filter((e) => e.inventoryDays && e.inventoryDays > 60);
  overStocked.slice(0, 3).forEach((item) => {
    optimizations.push({
      item: item.juiceName,
      current: "4-5 week stock",
      recommended: "2 week stock + weekly top-up",
      rationale: `Low turnover (${item.demandScore}/100). Reduce to prevent spoilage.`,
    });
  });

  // Under-stocked items
  const underStocked = report.entries.filter((e) => e.inventoryDays && e.inventoryDays < 10);
  underStocked.slice(0, 3).forEach((item) => {
    optimizations.push({
      item: item.juiceName,
      current: "<10 days stock",
      recommended: "3-4 week rolling inventory",
      rationale: `High demand (${item.demandScore}/100). Increase stock to avoid stockouts.`,
    });
  });

  return optimizations;
}

/**
 * Get smart juice combos based on demand and complementary nutritional profiles
 */
export function getSmartJuiceCombos(): Array<{
  title: string;
  juices: { id: number; name: string }[];
  bundlePrice: number;
  reason: string;
  targetGoal: string;
}> {
  const report = generateDemandReport();
  const topDemand = report.entries
    .filter((e) => e.level === "high")
    .slice(0, 6)
    .map((e) => PRODUCTS.juices.find((j) => j.id === e.juiceId)!)
    .filter(Boolean);

  const combos = [];

  // Combo 1: High-demand trio
  if (topDemand.length >= 3) {
    const combo1 = topDemand.slice(0, 3);
    combos.push({
      title: "🌟 Best Sellers Trio",
      juices: combo1.map((j) => ({ id: j.id, name: j.name })),
      bundlePrice: Math.round(combo1.reduce((sum, j) => sum + j.price, 0) * 0.88 * 100) / 100,
      reason: "Our three most popular juices right now",
      targetGoal: "variety",
    });
  }

  // Combo 2: Recovery focus (for active users)
  const recoveryJuices = topDemand.filter((j) =>
    ["Hydrate", "Protein", "Antioxidant", "Stamina"].includes(j.tag)
  );
  if (recoveryJuices.length >= 2) {
    combos.push({
      title: "💪 Recovery Stack",
      juices: recoveryJuices.slice(0, 3).map((j) => ({ id: j.id, name: j.name })),
      bundlePrice:
        Math.round(recoveryJuices.slice(0, 3).reduce((sum, j) => sum + j.price, 0) * 0.85 * 100) /
        100,
      reason: "Optimize post-workout recovery with protein & hydration",
      targetGoal: "recovery",
    });
  }

  // Combo 3: Immunity focus
  const immunityJuices = topDemand.filter((j) =>
    ["Immunity", "Vitamin C", "Antioxidant"].includes(j.tag)
  );
  if (immunityJuices.length >= 2) {
    combos.push({
      title: "🛡️ Immunity Arsenal",
      juices: immunityJuices.slice(0, 3).map((j) => ({ id: j.id, name: j.name })),
      bundlePrice:
        Math.round(immunityJuices.slice(0, 3).reduce((sum, j) => sum + j.price, 0) * 0.85 * 100) /
        100,
      reason: "Triple defense: vitamin C + antioxidants + immune boosters",
      targetGoal: "immunity",
    });
  }

  return combos;
}
