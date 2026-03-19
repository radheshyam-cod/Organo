import prisma from "../utils/prisma.js";

type DemandLevel = "low" | "medium" | "high";

function percentileThreshold(scores: number[], pct: number) {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor(pct * (sorted.length - 1)));
  return sorted[idx];
}

export async function getDemandReport() {
  const now = new Date();
  const since = new Date();
  since.setDate(now.getDate() - 30);

  const [products, orders, subscriptions] = await Promise.all([
    prisma.product.findMany(),
    prisma.order.findMany({
      where: { createdAt: { gte: since } },
      include: { items: true },
    }),
    prisma.subscription.findMany({
      where: { status: "ACTIVE" },
    }),
  ]);

  const orderQtyMap = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      orderQtyMap.set(item.productId, (orderQtyMap.get(item.productId) ?? 0) + item.quantity);
    }
  }

  const subQtyMap = new Map<string, number>();
  for (const sub of subscriptions) {
    const items = Array.isArray(sub.items) ? (sub.items as string[]) : [];
    for (const pid of items) {
      subQtyMap.set(pid, (subQtyMap.get(pid) ?? 0) + 1);
    }
  }

  const scores: number[] = [];
  const rows = products.map((p) => {
    const past30 = orderQtyMap.get(p.id) ?? 0;
    const subs = subQtyMap.get(p.id) ?? 0;
    // Treat weekly subscriptions as 4 orders/month approx.
    const subWeight = subs * 4;
    const score = past30 + subWeight;
    scores.push(score);
    return { product: p, past30, subs, score };
  });

  const highCut = percentileThreshold(scores, 0.66);
  const medCut = percentileThreshold(scores, 0.33);

  const result = rows.map((row) => {
    const avgDaily = row.past30 / 30;
    const demandLevel: DemandLevel =
      row.score >= highCut && row.score > 0
        ? "high"
        : row.score >= medCut && row.score > 0
          ? "medium"
          : "low";

    let wasteRisk: DemandLevel = "low";
    if (avgDaily <= 0.1 && row.product.stock > 0) {
      wasteRisk = "high";
    } else {
      const coverageDays = avgDaily > 0 ? row.product.stock / avgDaily : Infinity;
      if (coverageDays > 30) wasteRisk = "high";
      else if (coverageDays > 14) wasteRisk = "medium";
    }

    const suggested = Math.max(0, Math.ceil(avgDaily * 14 - row.product.stock));

    return {
      productId: row.product.id,
      name: row.product.name,
      demandLevel,
      wasteRisk,
      past30Orders: row.past30,
      activeSubscriptions: row.subs,
      stock: row.product.stock,
      suggestedSourcingQuantity: suggested,
    };
  });

  return {
    generatedAt: now.toISOString(),
    lookbackDays: 30,
    products: result,
  };
}
