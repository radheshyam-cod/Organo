import { PRODUCTS, type Product } from "../data/products";

export type Goal = "fat-loss" | "recovery" | "immunity";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";
export type WorkoutType = "none" | "cardio" | "strength" | "mixed" | "yoga" | "sports";
export type StressLevel = "low" | "moderate" | "high" | "very-high";
export type SleepQuality = "poor" | "fair" | "good" | "excellent";

export interface UserHealthProfile {
  // Demographics
  age: number;
  gender: "male" | "female" | "other";
  weight: number; // kg
  height: number; // cm

  // Activity & Fitness
  goal: Goal;
  activityLevel: ActivityLevel;
  workoutType: WorkoutType;
  workoutFrequency: number; // per week
  workoutTiming: "morning" | "afternoon" | "evening";

  // Health & Lifestyle
  sleepQuality: SleepQuality;
  sleepHours: number;
  stressLevel: StressLevel;

  // Diet & Preferences
  foodPreferences: string[]; // e.g., ["vegetarian", "low-carb"]
  allergies: string[];
  intolerances: string[];
  sugarSensitivity: boolean;
  diabetesRisk: "low" | "moderate" | "high";

  // Medical
  medicalConditions: string[];
  currentMedications: string[];
  wantsJuiceOnly: boolean;
}

export interface JuicePlanRecommendation {
  juice: Product;
  timing: "morning" | "midday" | "evening";
  servingSize: string;
  benefits: string[];
  keyIngredients: string[];
  whyItMatches: string;
  caloriesApprox: number;
  sugarContent: "low" | "moderate" | "high";
}

export interface DailyJuicePlan {
  userProfile: UserHealthProfile;
  juices: JuicePlanRecommendation[];
  mealSuggestions?: string[];
  hydrationTarget: string;
  safetyNotes: string[];
  whyThisPlanWorks: string;
  dailyCalorieContribution: number;
  adjustmentTips: string[];
}

// Calculate BMI and provide health context
function calculateBMI(weight: number, height: number): number {
  return weight / (height / 100) ** 2;
}

// Assess health risk factors
function assessHealthRisks(profile: UserHealthProfile): string[] {
  const risks: string[] = [];

  if (
    profile.medicalConditions.length > 0 &&
    profile.medicalConditions.some(
      (c) =>
        c.toLowerCase().includes("diabetes") ||
        c.toLowerCase().includes("kidney") ||
        c.toLowerCase().includes("dialysis")
    )
  ) {
    risks.push("diabetes-kidney");
  }

  if (profile.age > 35 && profile.activityLevel === "sedentary") {
    risks.push("sedentary-age");
  }

  if (profile.stressLevel === "very-high" && profile.sleepHours < 6) {
    risks.push("stress-sleep");
  }

  if (profile.sugarSensitivity || profile.diabetesRisk === "high") {
    risks.push("sugar-sensitive");
  }

  if (profile.currentMedications.length > 0) {
    risks.push("medication-interaction");
  }

  return risks;
}

// Score juices based on user profile and goal
function scoreJuiceForProfile(
  juice: Product,
  profile: UserHealthProfile,
  _healthRisks: string[],
  mealContext: "pre-workout" | "post-workout" | "meal-replacement" | "general"
): number {
  let score = 0;

  // Check for allergies/intolerances
  const ingredientSet = new Set(juice.ingredients.map((i) => i.toLowerCase()));
  for (const allergen of profile.allergies) {
    if (ingredientSet.has(allergen.toLowerCase())) {
      return -1000; // Disqualify
    }
  }
  for (const intolerance of profile.intolerances) {
    if (ingredientSet.has(intolerance.toLowerCase())) {
      return -1000; // Disqualify
    }
  }

  // Goal-specific scoring
  if (profile.goal === "fat-loss") {
    if (juice.tag === "Detox" || juice.tag === "Cleanse" || juice.tag === "Balance") score += 20;
    if (juice.tag === "Keto") score += 25;
    if (juice.tag === "Hydrate") score += 15;
    // Penalize high-sugar juices
    if (juice.name.includes("Berry") || juice.name.includes("Mango")) score -= 5;
  } else if (profile.goal === "recovery") {
    if (juice.tag === "Stamina" || juice.tag === "Antioxidant" || juice.tag === "Protein")
      score += 25;
    if (juice.tag === "Hydrate" || juice.tag === "Refresh") score += 20;
    if (juice.tag === "Energy") score += 10;
  } else if (profile.goal === "immunity") {
    if (juice.tag === "Immunity" || juice.tag === "Vitamin C") score += 30;
    if (juice.tag === "Antioxidant" || juice.tag === "Glow") score += 20;
    if (juice.tag === "Brain") score += 10;
  }

  // Activity-based scoring
  if (profile.workoutType !== "none") {
    if (
      mealContext === "post-workout" &&
      (juice.tag === "Protein" || juice.tag === "Stamina" || juice.tag === "Hydrate")
    ) {
      score += 15;
    }
    if (mealContext === "pre-workout" && (juice.tag === "Energy" || juice.tag === "Kick")) {
      score += 10;
    }
  }

  // Age-based adjustments
  if (profile.age > 40 && (juice.tag === "Antioxidant" || juice.tag === "Brain")) {
    score += 5;
  }

  // Stress/Sleep adjustments
  if (profile.stressLevel === "high" && (juice.tag === "Calm" || juice.tag === "Refresh")) {
    score += 10;
  }

  // Sugar sensitivity
  if (profile.sugarSensitivity || profile.diabetesRisk === "high") {
    if (juice.name.includes("Green") || juice.name.includes("Detox")) score += 10;
  }

  // Diversity bonus
  score += Math.random() * 3;

  return score;
}

// Generate personalized recommendations based on timing
function getJuiceForTiming(
  profile: UserHealthProfile,
  timing: "morning" | "midday" | "evening",
  healthRisks: string[],
  excludeJuices: number[] = []
): JuicePlanRecommendation | null {
  const juices = PRODUCTS.juices.filter((j) => !excludeJuices.includes(j.id));

  // Timing-specific preferences
  let timingBoost: Record<string, number> = {};

  if (timing === "morning") {
    timingBoost = {
      Energy: 20,
      Kick: 20,
      Immunity: 15,
      Detox: 15,
      "Vitamin C": 15,
    };
  } else if (timing === "midday") {
    // Check if it's post-workout
    if (profile.workoutTiming === "morning" || profile.workoutTiming === "afternoon") {
      timingBoost = {
        Hydrate: 20,
        Stamina: 20,
        Antioxidant: 15,
        Protein: 15,
        Refresh: 10,
      };
    } else {
      timingBoost = {
        Hydrate: 15,
        Balance: 15,
        Glow: 10,
        Refresh: 10,
      };
    }
  } else if (timing === "evening") {
    // Pre-sleep, lighter options
    timingBoost = {
      Calm: 20,
      Refresh: 15,
      Cleanse: 10,
      Brain: 10,
    };
  }

  // Score each juice
  const scored = juices.map((juice) => {
    let score = scoreJuiceForProfile(juice, profile, healthRisks, "general");

    // Apply timing boost
    if (timingBoost[juice.tag]) {
      score += timingBoost[juice.tag];
    }

    return { juice, score };
  });

  // Filter out disqualified juices
  const qualified = scored.filter((s) => s.score > -100);
  if (qualified.length === 0) return null;

  // Sort and select top
  qualified.sort((a, b) => b.score - a.score);
  const selected = qualified[0].juice;

  // Determine serving size and sugar content
  let servingSize = "500ml";
  let sugarContent: "low" | "moderate" | "high" = "moderate";

  if (profile.sugarSensitivity || profile.goal === "fat-loss") {
    servingSize = "250ml";
    sugarContent =
      selected.name.includes("Berry") || selected.name.includes("Fruit") ? "moderate" : "low";
  }

  // Approximate calories (rough estimate)
  const caloriesApprox = servingSize === "500ml" ? 140 : 70;

  // Generate explanation
  const whyItMatches = getMatchExplanation(selected, profile, timing);

  return {
    juice: selected,
    timing,
    servingSize,
    benefits: selected.benefits.slice(0, 3),
    keyIngredients: selected.ingredients.slice(0, 3),
    whyItMatches,
    caloriesApprox,
    sugarContent,
  };
}

function getMatchExplanation(juice: Product, profile: UserHealthProfile, timing: string): string {
  // Timing-specific preferences
  const timingMatch: Record<"morning" | "midday" | "evening", string> = {
    morning: `Perfect on an empty stomach in the morning to ${juice.benefits[0]?.toLowerCase() || "start your day"}`,
    midday: `Ideal midday boost for continued energy and ${juice.benefits[1]?.toLowerCase() || "wellness"}`,
    evening: `Wind-down drink supporting overnight recovery with ${juice.benefits[0]?.toLowerCase() || "rest"}`,
  };

  return `${juice.benefits[0]?.toLowerCase() || "nutrition"} for your ${profile.goal.replace("-", " ")} goal — ${timingMatch[timing as "morning" | "midday" | "evening"]}`;
}

/**
 * Generate a complete personalized daily juice plan
 */
export function generatePersonalizedPlan(profile: UserHealthProfile): DailyJuicePlan {
  const healthRisks = assessHealthRisks(profile);
  const bmi = calculateBMI(profile.weight, profile.height);

  // Generate recommendations
  const morning = getJuiceForTiming(profile, "morning", healthRisks);
  const midday = getJuiceForTiming(
    profile,
    "midday",
    healthRisks,
    morning ? [morning.juice.id] : []
  );
  const evening = getJuiceForTiming(
    profile,
    "evening",
    healthRisks,
    morning && midday ? [morning.juice.id, midday.juice.id] : morning ? [morning.juice.id] : []
  );

  const juices = [morning, midday, evening].filter((j) => j !== null) as JuicePlanRecommendation[];

  // Calculate daily juice contribution
  const dailyCalorieContribution = juices.reduce((sum, j) => sum + j.caloriesApprox, 0);

  // Safety notes
  const safetyNotes = generateSafetyNotes(profile, healthRisks);

  // Why this plan works
  const whyThisPlanWorks = generatePlanExplanation(profile);

  // Adjustment tips
  const adjustmentTips = generateAdjustmentTips(profile, bmi);

  // Meal suggestions (if requested)
  const mealSuggestions = profile.wantsJuiceOnly ? undefined : generateMealSuggestions(profile);

  // Hydration target
  let hydrationTarget = "2-3L water daily";
  if (profile.activityLevel === "very-active" || profile.workoutType !== "none") {
    hydrationTarget = "3-4L water daily + electrolyte support";
  }

  return {
    userProfile: profile,
    juices,
    mealSuggestions,
    hydrationTarget,
    safetyNotes,
    whyThisPlanWorks,
    dailyCalorieContribution,
    adjustmentTips,
  };
}

function generateSafetyNotes(profile: UserHealthProfile, healthRisks: string[]): string[] {
  const notes: string[] = [];

  if (healthRisks.includes("diabetes-kidney")) {
    notes.push(
      "⚠️ Medical Consultation Required: Consult your healthcare provider before starting this plan. Kidney function and blood sugar management may require personalized modifications."
    );
  }

  if (healthRisks.includes("medication-interaction")) {
    notes.push(
      "⚠️ Medication Interaction: Your current medications may interact with juice nutrients. Review with your pharmacist or doctor before starting."
    );
  }

  if (healthRisks.includes("sugar-sensitive")) {
    notes.push(
      "ℹ️ Sugar Monitoring: We recommend smaller serving sizes and monitoring your blood sugar response initially."
    );
  }

  if (profile.sleepHours < 5) {
    notes.push(
      "💤 Sleep Priority: Boost your juice benefits by improving sleep quality — aim for 7-8 hours nightly."
    );
  }

  if (profile.stressLevel === "very-high") {
    notes.push(
      "🧘 Stress Management: Pair this juice plan with stress reduction techniques (meditation, yoga) for optimal results."
    );
  }

  if (profile.intolerances.length > 0) {
    notes.push(`✓ Allergies/Intolerances Noted: Plan excludes ${profile.intolerances.join(", ")}`);
  }

  if (notes.length === 0) {
    notes.push("✓ No contraindications detected. This plan is safe for your profile.");
  }

  return notes;
}

function generatePlanExplanation(profile: UserHealthProfile): string {
  const goalContext = {
    "fat-loss":
      "This plan prioritizes low-sugar greens and cleansing ingredients to support metabolic health and satiety. Timing before meals maximizes appetite suppression.",
    recovery:
      "This plan focuses on anti-inflammatory ingredients, electrolytes, and antioxidants to accelerate muscle repair. Post-workout timing optimizes nutrient absorption.",
    immunity:
      "This plan emphasizes vitamin C, antioxidants, and immune-supporting ingredients consumed daily for cumulative immune strengthening. Consistency is key.",
  };

  const activityContext =
    profile.workoutType !== "none"
      ? ` Combined with your ${profile.workoutFrequency}x/week ${profile.workoutType} routine, these juices optimize performance and recovery.`
      : " These juices support your wellness goals through optimal nutrition timing.";

  const lifestyleContext =
    profile.stressLevel === "high"
      ? " Consistent juice intake helps manage stress through nutrient support."
      : " Your consistent lifestyle supports maximum juice benefits.";

  return `${goalContext[profile.goal as Goal]}${activityContext}${lifestyleContext}`;
}

function generateAdjustmentTips(profile: UserHealthProfile, bmi: number): string[] {
  const tips: string[] = [];

  if (profile.goal === "fat-loss" && bmi > 25) {
    tips.push(
      "📉 Fat Loss Tip: Combine juices with strength training 3x/week to preserve muscle while losing fat"
    );
  }

  if (profile.workoutType === "strength") {
    tips.push(
      "💪 Post-Workout: Consume juices within 30 minutes after workouts for optimal recovery"
    );
  }

  if (profile.sleepQuality === "poor") {
    tips.push("😴 Sleep Boost: Evening juice + consistent sleep schedule amplifies juice benefits");
  }

  if (profile.activityLevel === "sedentary") {
    tips.push("🚶 Movement Matters: Add 10,000 steps daily to amplify juice effects");
  }

  if (profile.stressLevel === "high") {
    tips.push(
      "🧘 Mindful Ritual: Consume juices mindfully — turn it into a stress-reduction practice"
    );
  }

  if (profile.sugarSensitivity) {
    tips.push(
      "📊 Monitor Response: Track energy levels for 2 weeks to assess your personal response"
    );
  }

  if (profile.age > 40) {
    tips.push(
      "⏰ Age Optimization: Morning juices are especially beneficial for metabolic health at your age"
    );
  }

  return tips;
}

function generateMealSuggestions(profile: UserHealthProfile): string[] {
  const suggestions: string[] = [];

  if (profile.goal === "fat-loss") {
    suggestions.push("🥗 Breakfast: Protein omelette + whole grain toast (juice 30 min before)");
    suggestions.push(
      "🍗 Lunch: Grilled chicken + roasted vegetables (juice 2 hours after morning juice)"
    );
    suggestions.push("🐟 Dinner: Baked salmon + sweet potato (juice 2 hours after lunch)");
  } else if (profile.goal === "recovery") {
    suggestions.push("🥣 Post-Workout: Juice + banana + Greek yogurt within 30 min");
    suggestions.push("🍚 Lunch: Rice bowl + protein + vegetables (juice 1 hour after workout)");
    suggestions.push(
      "🥩 Dinner: Lean protein + complex carbs + greens (juice before bed for overnight recovery)"
    );
  } else if (profile.goal === "immunity") {
    suggestions.push("🥣 Breakfast: Oatmeal + berries + nuts + juice");
    suggestions.push("🥗 Lunch: Colorful salad (rainbow veggies) + protein");
    suggestions.push("🐔 Dinner: Herb-roasted chicken + seasonal vegetables + juice");
  }

  return suggestions;
}
