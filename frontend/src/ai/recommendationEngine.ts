import { PRODUCTS } from "../data/products";

// ============ TYPES & INTERFACES ============

export interface UserContext {
  // Activity signals
  workedOutToday?: boolean;
  workoutType?: "cardio" | "strength" | "flexibility" | "intense";
  workoutIntensity?: "light" | "moderate" | "intense";
  timesSinceWorkout?: number; // hours

  // Health signals
  sleepQuality?: "poor" | "fair" | "good" | "excellent";
  stressLevel?: "low" | "medium" | "high";
  energyLevel?: "low" | "medium" | "high";
  skippedBreakfast?: boolean;
  recentlyIll?: boolean;
  recoveryMode?: boolean;

  // Environmental signals
  weatherCondition?: "hot" | "cold" | "mild" | "humid";
  temperature?: number; // Celsius

  // Temporal signals
  timeOfDay?: "early-morning" | "morning" | "midday" | "afternoon" | "evening" | "night";
  dayOfWeek?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

  // Goal & history signals
  currentGoal?:
    | "fat-loss"
    | "recovery"
    | "immunity"
    | "hydration"
    | "detox"
    | "energy"
    | "endurance";
  recentlyBoughtCategory?: string[];
  purchaseHistory?: number[]; // juice IDs
  lastRecommendationTime?: number; // timestamp
  medicalRestrictions?: string[]; // ingredients to avoid
  allergies?: string[];

  // Purchase signals
  shoppingFrequency?: "daily" | "weekly" | "occasional";
  budgetTier?: "economy" | "standard" | "premium";
}

export interface RecommendationSignal {
  name: string;
  priority: "critical" | "high" | "medium" | "low";
  score: number; // 0-100
}

export interface JuiceRecommendation {
  juiceId: number;
  juiceName: string;
  price: number;
  trigger: string;
  reason: string;
  bestTime: string;
  expectedBenefit: string;
  alternative?: {
    juiceId: number;
    juiceName: string;
    reason: string;
  };
  confidenceScore: number; // 0-100
  signals: RecommendationSignal[];
  warnings?: string;
}

// ============ SIGNAL DETECTION ============

export function detectSignals(context: UserContext): RecommendationSignal[] {
  const signals: RecommendationSignal[] = [];

  // Workout signal
  if (context.workedOutToday) {
    signals.push({
      name: "Post-Workout Recovery",
      priority: "critical",
      score: context.workoutIntensity === "intense" ? 95 : 80,
    });
  }

  // Sleep quality signal
  if (context.sleepQuality === "poor") {
    signals.push({
      name: "Poor Sleep Quality",
      priority: "high",
      score: 85,
    });
  }

  // Stress signal
  if (context.stressLevel === "high") {
    signals.push({
      name: "High Stress",
      priority: "high",
      score: 80,
    });
  }

  // Energy signal
  if (context.energyLevel === "low") {
    signals.push({
      name: "Low Energy",
      priority: "high",
      score: 85,
    });
  }

  // Breakfast skipped signal
  if (context.skippedBreakfast && context.timeOfDay === "morning") {
    signals.push({
      name: "Skipped Breakfast",
      priority: "medium",
      score: 75,
    });
  }

  // Recovery mode signal
  if (context.recentlyIll || context.recoveryMode) {
    signals.push({
      name: "Post-Illness Recovery",
      priority: "critical",
      score: 90,
    });
  }

  // Hot weather signal
  if (context.weatherCondition === "hot" || (context.temperature && context.temperature > 28)) {
    signals.push({
      name: "Hot Weather",
      priority: "medium",
      score: 70,
    });
  }

  // Cold weather signal
  if (context.weatherCondition === "cold" || (context.temperature && context.temperature < 10)) {
    signals.push({
      name: "Cold Weather",
      priority: "low",
      score: 65,
    });
  }

  // Time-based signals
  if (context.timeOfDay === "early-morning") {
    signals.push({
      name: "Early Morning Energy",
      priority: "medium",
      score: 70,
    });
  }

  if (context.timeOfDay === "evening") {
    signals.push({
      name: "Evening Calm",
      priority: "low",
      score: 60,
    });
  }

  // Goal-based signal
  if (context.currentGoal) {
    const goalScores: Record<string, number> = {
      "fat-loss": 85,
      recovery: 90,
      immunity: 85,
      hydration: 80,
      detox: 75,
      energy: 85,
      endurance: 80,
    };
    signals.push({
      name: `Goal: ${context.currentGoal}`,
      priority: "high",
      score: goalScores[context.currentGoal] || 75,
    });
  }

  return signals;
}

// ============ JUICE MATCHING & SCORING ============

function scoreJuiceForContext(
  juiceId: number,
  context: UserContext,
  signals: RecommendationSignal[]
): number {
  const juice = PRODUCTS.juices.find((j) => j.id === juiceId);
  if (!juice) return 0;

  let score = 50; // baseline

  // Signal-based scoring
  signals.forEach((signal) => {
    if (signal.priority === "critical") score += signal.score * 0.25;
    else if (signal.priority === "high") score += signal.score * 0.15;
    else if (signal.priority === "medium") score += signal.score * 0.1;
    else if (signal.priority === "low") score += signal.score * 0.05;
  });

  // Juice tag matching
  if (
    context.currentGoal === "recovery" &&
    ["Hydrate", "Protein", "Antioxidant"].includes(juice.tag)
  ) {
    score += 15;
  }
  if (
    context.currentGoal === "immunity" &&
    ["Immunity", "Vitamin C", "Antioxidant"].includes(juice.tag)
  ) {
    score += 15;
  }
  if (context.currentGoal === "energy" && ["Energy", "Kick", "Stamina"].includes(juice.tag)) {
    score += 15;
  }
  if (context.currentGoal === "fat-loss" && ["Detox", "Cleanse", "Balance"].includes(juice.tag)) {
    score += 12;
  }
  if (context.currentGoal === "hydration" && ["Hydrate", "Refresh"].includes(juice.tag)) {
    score += 15;
  }

  // Workout recovery
  if (context.workedOutToday && context.timesSinceWorkout && context.timesSinceWorkout <= 2) {
    if (["Hydrate", "Protein", "Antioxidant", "Recovery"].includes(juice.tag)) {
      score += 20;
    }
  }

  // Sleep & stress recovery
  if (context.sleepQuality === "poor" && ["Calm", "Balance", "Antioxidant"].includes(juice.tag)) {
    score += 15;
  }
  if (context.stressLevel === "high" && ["Calm", "Balance", "Refresh"].includes(juice.tag)) {
    score += 15;
  }

  // Time-based recommendations
  if (context.timeOfDay === "early-morning" && ["Energy", "Kick", "Immunity"].includes(juice.tag)) {
    score += 10;
  }
  if (context.timeOfDay === "evening" && ["Calm", "Balance", "Hydrate"].includes(juice.tag)) {
    score += 10;
  }
  if (context.timeOfDay === "midday" && ["Hydrate", "Energy", "Refresh"].includes(juice.tag)) {
    score += 8;
  }

  // Weather-based recommendations
  if (context.weatherCondition === "hot" && ["Hydrate", "Refresh"].includes(juice.tag)) {
    score += 12;
  }

  // Recent purchase history (avoid repetition)
  if (context.lastRecommendationTime) {
    const hoursSinceLastRec = (Date.now() - context.lastRecommendationTime) / (1000 * 60 * 60);
    if (hoursSinceLastRec < 12) {
      score -= 20; // heavily penalize recent recommendations
    }
  }

  // Recent purchase history (slight boost for tried & trusted)
  if (context.purchaseHistory && context.purchaseHistory.includes(juiceId)) {
    if (context.purchaseHistory.indexOf(juiceId) < 3) {
      score += 5; // slight boost for favorites
    }
  }

  // Budget consideration
  if (context.budgetTier === "economy" && juice.price > 8.99) {
    score -= 15;
  }

  return Math.min(100, Math.max(0, score));
}

function checkRestrictions(juiceId: number, context: UserContext): boolean {
  const juice = PRODUCTS.juices.find((j) => j.id === juiceId);
  if (!juice) return false;

  // Check allergies
  if (context.allergies && context.allergies.length > 0) {
    const hasAllergen = juice.ingredients.some((ing) =>
      context.allergies!.some((allergen) => ing.toLowerCase().includes(allergen.toLowerCase()))
    );
    if (hasAllergen) return false;
  }

  // Check medical restrictions
  if (context.medicalRestrictions && context.medicalRestrictions.length > 0) {
    const hasRestricted = juice.ingredients.some((ing) =>
      context.medicalRestrictions!.some((restriction) =>
        ing.toLowerCase().includes(restriction.toLowerCase())
      )
    );
    if (hasRestricted) return false;
  }

  // Special checks
  if (context.stressLevel === "high" && juice.tag === "Kick") {
    return false; // Avoid high-caffeine when stressed
  }

  if (
    context.sleepQuality === "poor" &&
    context.timeOfDay === "evening" &&
    juice.tag === "Energy"
  ) {
    return false; // Avoid energy drinks before bed
  }

  return true;
}

// ============ RECOMMENDATION GENERATION ============

export function generateRecommendation(context: UserContext): JuiceRecommendation | null {
  const signals = detectSignals(context);

  if (signals.length === 0) {
    return null; // No clear signals
  }

  // Score all valid juices
  const scoredJuices: Array<{ juice: (typeof PRODUCTS.juices)[0]; score: number }> = PRODUCTS.juices
    .filter((juice) => checkRestrictions(juice.id, context))
    .map((juice) => ({
      juice,
      score: scoreJuiceForContext(juice.id, context, signals),
    }))
    .sort((a, b) => b.score - a.score);

  if (scoredJuices.length === 0) {
    return null; // All juices restricted
  }

  const topJuice = scoredJuices[0];
  const alternativeJuice = scoredJuices.length > 1 ? scoredJuices[1] : null;

  // Generate trigger message
  const trigger = generateTriggerMessage(signals);

  // Generate reason
  const reason = generateReason(topJuice.juice, context);

  // Determine best time
  const bestTime = determineBestTime(topJuice.juice, context);

  // Generate expected benefit
  const benefit = generateExpectedBenefit(topJuice.juice);

  // Generate warnings if applicable
  const warnings = generateWarnings(topJuice.juice, context);

  return {
    juiceId: topJuice.juice.id,
    juiceName: topJuice.juice.name,
    price: topJuice.juice.price,
    trigger,
    reason,
    bestTime,
    expectedBenefit: benefit,
    alternative: alternativeJuice
      ? {
          juiceId: alternativeJuice.juice.id,
          juiceName: alternativeJuice.juice.name,
          reason: `${alternativeJuice.juice.tag} profile also supports your current needs.`,
        }
      : undefined,
    confidenceScore: Math.round(topJuice.score),
    signals,
    warnings,
  };
}

// ============ MESSAGE GENERATION ============

function generateTriggerMessage(signals: RecommendationSignal[]): string {
  const criticalSignals = signals.filter((s) => s.priority === "critical");
  const highSignals = signals.filter((s) => s.priority === "high");

  if (criticalSignals.length > 0) {
    return criticalSignals[0].name;
  }
  if (highSignals.length > 0) {
    return highSignals[0].name;
  }
  return signals[0].name;
}

function generateReason(juice: (typeof PRODUCTS.juices)[0], context: UserContext): string {
  const reasons: string[] = [];

  // Check what signals match this juice's benefits
  if (context.workedOutToday && ["Hydrate", "Protein", "Antioxidant"].includes(juice.tag)) {
    reasons.push(`${juice.tag} supports post-workout recovery`);
  }

  if (context.sleepQuality === "poor" && ["Calm", "Balance"].includes(juice.tag)) {
    reasons.push(`${juice.tag} helps restore balance after restless sleep`);
  }

  if (context.stressLevel === "high" && ["Calm", "Balance"].includes(juice.tag)) {
    reasons.push(`${juice.tag} has adaptogens to counter stress`);
  }

  if (context.currentGoal === "immunity" && ["Immunity", "Vitamin C"].includes(juice.tag)) {
    reasons.push(`High in immune-supporting nutrients`);
  }

  if (context.weatherCondition === "hot" && ["Hydrate", "Refresh"].includes(juice.tag)) {
    reasons.push(`Perfect hydration choice for hot weather`);
  }

  if (context.energyLevel === "low" && ["Energy", "Kick"].includes(juice.tag)) {
    reasons.push(`Quick natural energy boost from superfruits`);
  }

  if (context.recentlyIll && ["Antioxidant", "Immunity", "Vitamin C"].includes(juice.tag)) {
    reasons.push(`Nutrient-dense to support your recovery`);
  }

  if (reasons.length === 0) {
    reasons.push(`${juice.tag} profile matches your current needs`);
  }

  return reasons[0];
}

function determineBestTime(juice: (typeof PRODUCTS.juices)[0], context: UserContext): string {
  // Post-workout timing
  if (context.workedOutToday && context.timesSinceWorkout && context.timesSinceWorkout <= 2) {
    if (["Hydrate", "Protein", "Antioxidant"].includes(juice.tag)) {
      return `Within ${Math.max(0, 120 - context.timesSinceWorkout * 60)} minutes while muscles are primed to recover`;
    }
  }

  // Energy timing
  if (["Energy", "Kick"].includes(juice.tag)) {
    if (context.timeOfDay === "early-morning") {
      return "First thing with breakfast for sustained morning energy";
    }
    if (context.timeOfDay === "midday") {
      return "2-3 PM before the afternoon energy dip";
    }
  }

  // Calm timing
  if (["Calm", "Balance"].includes(juice.tag)) {
    if (context.stressLevel === "high") {
      return "When you need immediate calm, or with lunch";
    }
    return "Evening with dinner for better sleep";
  }

  // Hydration timing
  if (["Hydrate", "Refresh"].includes(juice.tag)) {
    if (context.weatherCondition === "hot") {
      return "Sip throughout the day, especially mid-afternoon";
    }
    return "Post-workout or any time for optimal hydration";
  }

  // Immune support timing
  if (["Immunity", "Vitamin C"].includes(juice.tag)) {
    if (context.recentlyIll) {
      return "2-3 times daily during recovery period";
    }
    return "Daily, preferably with breakfast for consistent immune support";
  }

  return "Best consumed as part of your daily wellness routine";
}

function generateExpectedBenefit(juice: (typeof PRODUCTS.juices)[0]): string {
  const benefits: Record<string, string> = {
    Immunity: "Stronger immune defenses against seasonal threats",
    Energy: "Sustained energy lift without the crash",
    Hydrate: "Deep cellular hydration and electrolyte balance",
    Antioxidant: "Powerful cellular repair and recovery",
    Calm: "Reduced stress and improved mental clarity",
    Protein: "Muscle recovery and sustained satiety",
    Detox: "Natural cleanse and improved digestion",
    Refresh: "Mental clarity and physical rejuvenation",
    Stamina: "Enhanced endurance for your next challenge",
    Recovery: "Faster muscle repair and soreness reduction",
    Keto: "Low-sugar fuel for metabolic goals",
    Cleanse: "Gentle system reset and toxin elimination",
    Balance: "Hormonal and emotional equilibrium",
  };

  return benefits[juice.tag] || "Optimized nutrition to support your wellness goals";
}

function generateWarnings(
  juice: (typeof PRODUCTS.juices)[0],
  context: UserContext
): string | undefined {
  if (context.currentGoal === "fat-loss" && juice.price > 11.99) {
    return "Consider budget-friendly options if frequently consuming";
  }

  if (context.stressLevel === "high" && juice.tag === "Kick") {
    return "High-caffeine content may amplify stress—consider Calm alternative";
  }

  if (context.recentlyIll && juice.tag === "Energy") {
    return "Wait until fully recovered before high-intensity juices";
  }

  return undefined;
}

// ============ BATCH RECOMMENDATIONS ============

export function generateWeeklyRecommendations(context: UserContext): JuiceRecommendation[] {
  const recommendations: JuiceRecommendation[] = [];
  const daysOfWeek: Array<typeof context.dayOfWeek> = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  daysOfWeek.forEach((day, index) => {
    const dayContext = { ...context, dayOfWeek: day };

    // Vary signal detection for different days
    if (index % 2 === 0) {
      dayContext.workedOutToday = true;
      dayContext.workoutIntensity = "moderate";
    }
    if (index % 3 === 0) {
      dayContext.stressLevel = "medium";
    }
    if (index % 4 === 0) {
      dayContext.sleepQuality = "good";
    }

    const rec = generateRecommendation(dayContext);
    if (rec) {
      recommendations.push(rec);
    }
  });

  return recommendations;
}
