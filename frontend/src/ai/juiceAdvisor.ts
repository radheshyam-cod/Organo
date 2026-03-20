import { PRODUCTS, type Product } from "../data/products";

export type Goal =
  | "fat-loss"
  | "recovery"
  | "immunity"
  | "immunity-boost"
  | "weight-loss"
  | "skin-glow"
  | "post-workout";
export type TimeOfDay = "morning" | "afternoon" | "evening";

export interface JuiceRecommendation {
  juice: Product;
  reason: string;
  timing: string;
  score: number;
  nutritionScore?: number;
}

export interface DailyPlan {
  morning: JuiceRecommendation;
  afternoon: JuiceRecommendation;
  evening: JuiceRecommendation;
}

export interface SmartBanner {
  title: string;
  message: string;
  emoji: string;
  juiceName: string;
  juiceId: number;
}

export interface BundleSuggestion {
  juices: Product[];
  bundleTitle: string;
  bundleDescription: string;
  bundlePrice: number;
  savings: number;
}

// Tag-to-goal scoring mapping
const GOAL_TAGS: Record<Goal, string[]> = {
  "fat-loss": ["Detox", "Keto", "Cleanse", "Balance", "Kick", "Stamina"],
  "weight-loss": ["Detox", "Cleanse", "Balance", "Fiber", "Metabolism"],
  recovery: ["Stamina", "Hydrate", "Antioxidant", "Protein", "Energy", "Refresh"],
  "post-workout": ["Protein", "Recovery", "Stamina", "Hydrate"],
  immunity: ["Immunity", "Antioxidant", "Vitamin C", "Glow", "Brain"],
  "immunity-boost": ["Immunity", "Antioxidant", "Vitamin C", "Amla", "Tulsi"],
  "skin-glow": ["Glow", "Hydrate", "Collagen", "Antioxidant", "Vitamin C"],
};

// Time-of-day preferred tags
const TIME_TAGS: Record<TimeOfDay, string[]> = {
  morning: ["Energy", "Kick", "Immunity", "Detox", "Vitamin C", "Amla", "Tulsi"],
  afternoon: ["Hydrate", "Refresh", "Balance", "Antioxidant", "Glow", "Ginger"],
  evening: ["Calm", "Cleanse", "Protein", "Brain", "Recovery", "Ashwagandha", "Turmeric"],
};

// Workout boost — these juices score extra when user worked out
const WORKOUT_BOOST_IDS = [18, 9, 7, 21, 15, 19]; // Beet It, Ruby Revive, Emerald Hydration, Watermelon, Berry Blast, Pure Greens
const AYURVEDIC_BOOST_INGREDIENTS = ["amla", "tulsi", "turmeric", "ginger", "ashwagandha"];

// Nutritional profiles for better balancing
const NUTRITIONAL_PROFILES: Record<
  number,
  { protein: number; carbs: number; fiber: number; sugar: number; hydration: number }
> = {
  1: { protein: 1, carbs: 8, fiber: 2, sugar: 6, hydration: 70 },
  2: { protein: 2, carbs: 5, fiber: 3, sugar: 2, hydration: 85 },
  3: { protein: 1, carbs: 12, fiber: 2, sugar: 10, hydration: 80 },
  7: { protein: 3, carbs: 10, fiber: 2, sugar: 8, hydration: 88 },
  9: { protein: 2, carbs: 11, fiber: 1, sugar: 9, hydration: 75 },
  18: { protein: 2, carbs: 9, fiber: 2, sugar: 7, hydration: 70 },
  19: { protein: 3, carbs: 4, fiber: 4, sugar: 1, hydration: 90 },
  21: { protein: 1, carbs: 11, fiber: 1, sugar: 10, hydration: 92 },
};

interface UserPreferences {
  favoriteJuices: number[];
  recentlyRecommended: number[];
  dietaryRestrictions: string[];
  priceRange?: "budget" | "mid" | "premium";
}

function getUserPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem("organo_user_preferences");
    return raw
      ? JSON.parse(raw)
      : {
          favoriteJuices: [],
          recentlyRecommended: [],
          dietaryRestrictions: [],
        };
  } catch {
    return {
      favoriteJuices: [],
      recentlyRecommended: [],
      dietaryRestrictions: [],
    };
  }
}

function saveUserPreferences(prefs: UserPreferences) {
  try {
    localStorage.setItem("organo_user_preferences", JSON.stringify(prefs));
  } catch {
    // silently fail
  }
}

function countSharedIngredients(juice1: Product, juice2: Product): number {
  const set1 = new Set(juice1.ingredients.map((i) => i.toLowerCase()));
  return juice2.ingredients.filter((i) => set1.has(i.toLowerCase())).length;
}

function calculateNutritionScore(juice: Product, timeOfDay: TimeOfDay, goal: Goal): number {
  const profile = NUTRITIONAL_PROFILES[juice.id];
  if (!profile) return 0;

  let score = 0;

  const hasAyurvedic = juice.ingredients.some((i) =>
    AYURVEDIC_BOOST_INGREDIENTS.includes(i.toLowerCase())
  );
  if (hasAyurvedic) score += 8;

  // Goal-specific nutrition preferences
  if (goal === "fat-loss") {
    score += profile.fiber * 2; // high fiber good for satiety
    score -= profile.sugar; // low sugar preferred
    score += profile.protein; // protein for metabolism
  } else if (goal === "recovery" || goal === "post-workout") {
    score += profile.protein * 3; // high protein for muscle rebuild
    score += profile.hydration; // hydration for recovery
    score += profile.carbs; // carbs for glycogen replenishment
  } else if (goal === "immunity" || goal === "immunity-boost") {
    score += profile.fiber * 1.5;
    score += profile.carbs; // energy for immune function
  } else if (goal === "skin-glow") {
    score += profile.hydration * 1.5;
    score += profile.fiber;
  }

  // Time-of-day adjustments
  if (timeOfDay === "morning") {
    score += profile.protein; // protein breakfast
    score += profile.carbs * 1.5;
  } else if (timeOfDay === "afternoon") {
    score += profile.hydration * 1.5; // hydration boost mid-day
  }

  return Math.max(0, Math.round(score));
}

function scoreJuice(
  juice: Product,
  goal: Goal,
  workedOut: boolean,
  timeOfDay: TimeOfDay,
  selectedJuices: Product[] = [],
  userPrefs?: UserPreferences
): number {
  let score = 0;

  // Goal match (weighted higher)
  const goalTags = GOAL_TAGS[goal];
  if (goalTags.includes(juice.tag)) score += 15;

  // Time of day match
  const timeTags = TIME_TAGS[timeOfDay];
  if (timeTags.includes(juice.tag)) score += 8;

  // Ayurvedic ingredient boost
  if (juice.ingredients.some((i) => AYURVEDIC_BOOST_INGREDIENTS.includes(i.toLowerCase()))) {
    score += 10;
  }

  // Workout boost
  if (workedOut && WORKOUT_BOOST_IDS.includes(juice.id)) score += 12;

  // Nutritional score
  const nutritionBonus = calculateNutritionScore(juice, timeOfDay, goal);
  score += nutritionBonus * 0.3;

  // Ingredient diversity penalty (avoid overlapping ingredients)
  let diversityPenalty = 0;
  selectedJuices.forEach((selected) => {
    const sharedCount = countSharedIngredients(juice, selected);
    diversityPenalty += sharedCount * 1.5;
  });
  score -= diversityPenalty;

  // User preference boost
  if (userPrefs) {
    if (userPrefs.favoriteJuices.includes(juice.id)) score += 5;
    if (userPrefs.recentlyRecommended.includes(juice.id)) score -= 8; // penalize if recently recommended
  }

  // Small randomization for variety
  score += Math.random() * 1.5;

  return Math.max(0, score);
}

function getReason(juice: Product, goal: Goal, workedOut: boolean, _timeOfDay: TimeOfDay): string {
  if (workedOut && WORKOUT_BOOST_IDS.includes(juice.id)) {
    return `Post-workout powerhouse — ${juice.benefits[0].toLowerCase()} to accelerate recovery and rebuild strength.`;
  }
  const goalMessages: Partial<Record<Goal, string>> = {
    "fat-loss": `Turbocharges your fat loss journey — ${juice.benefits[0].toLowerCase()} for a leaner, energized you.`,
    recovery: `Accelerates recovery — ${juice.benefits[0].toLowerCase()} so your body rebuilds stronger and faster.`,
    immunity: `Fortifies immune defenses — ${juice.benefits[0].toLowerCase()} to keep you at peak strength.`,
  };
  return (
    goalMessages[goal] || `Supports your ${goal} goals with ${juice.benefits[0].toLowerCase()}.`
  );
}

function getTiming(timeOfDay: TimeOfDay): string {
  const times: Record<TimeOfDay, string> = {
    morning:
      "Best enjoyed on an empty stomach first thing in the morning — maximum nutrient absorption.",
    afternoon: "Perfect as a midday pick-me-up between meals — sustained energy without the crash.",
    evening: "Ideal as a wind-down drink before or after dinner — aids recovery while you rest.",
  };
  return times[timeOfDay];
}

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function getDailyJuicePlan(goal: Goal, workedOut: boolean): DailyPlan {
  const juices = PRODUCTS.juices;
  const userPrefs = getUserPreferences();

  const scored = juices.map((juice) => ({
    juice,
    morningScore: scoreJuice(juice, goal, workedOut, "morning", [], userPrefs),
    afternoonScore: scoreJuice(juice, goal, workedOut, "afternoon", [], userPrefs),
    eveningScore: scoreJuice(juice, goal, workedOut, "evening", [], userPrefs),
  }));

  const sortedMorning = [...scored].sort((a, b) => b.morningScore - a.morningScore);
  const morningJuice = sortedMorning[0].juice;

  // Afternoon: pick from remaining, exclude morning pick, consider ingredient diversity
  const sortedAfternoon = [...scored]
    .filter((s) => s.juice.id !== morningJuice.id)
    .map((s) => ({
      ...s,
      afternoonScore: scoreJuice(s.juice, goal, workedOut, "afternoon", [morningJuice], userPrefs),
    }))
    .sort((a, b) => b.afternoonScore - a.afternoonScore);
  const afternoonJuice = sortedAfternoon[0].juice;

  // Evening: pick from remaining, exclude morning and afternoon picks, maximize diversity
  const sortedEvening = [...scored]
    .filter((s) => s.juice.id !== morningJuice.id && s.juice.id !== afternoonJuice.id)
    .map((s) => ({
      ...s,
      eveningScore: scoreJuice(
        s.juice,
        goal,
        workedOut,
        "evening",
        [morningJuice, afternoonJuice],
        userPrefs
      ),
    }))
    .sort((a, b) => b.eveningScore - a.eveningScore);
  const eveningJuice = sortedEvening[0].juice;

  // Update user preferences with recently recommended
  const newRecentlyRecommended = [
    morningJuice.id,
    afternoonJuice.id,
    eveningJuice.id,
    ...userPrefs.recentlyRecommended,
  ].slice(0, 9);
  saveUserPreferences({
    ...userPrefs,
    recentlyRecommended: newRecentlyRecommended,
  });

  return {
    morning: {
      juice: morningJuice,
      reason: getReason(morningJuice, goal, workedOut, "morning"),
      timing: getTiming("morning"),
      score: sortedMorning[0].morningScore,
      nutritionScore: calculateNutritionScore(morningJuice, "morning", goal),
    },
    afternoon: {
      juice: afternoonJuice,
      reason: getReason(afternoonJuice, goal, workedOut, "afternoon"),
      timing: getTiming("afternoon"),
      score: sortedAfternoon[0].afternoonScore,
      nutritionScore: calculateNutritionScore(afternoonJuice, "afternoon", goal),
    },
    evening: {
      juice: eveningJuice,
      reason: getReason(eveningJuice, goal, workedOut, "evening"),
      timing: getTiming("evening"),
      score: sortedEvening[0].eveningScore,
      nutritionScore: calculateNutritionScore(eveningJuice, "evening", goal),
    },
  };
}

export function getSmartBanner(workedOut: boolean, goal: Goal): SmartBanner {
  if (workedOut) {
    return {
      title: "Recovery mode",
      message: "You crushed it today! Refuel & recover with",
      emoji: "🏋️",
      juiceName: "Beet It",
      juiceId: 18,
    };
  }

  const banners: Partial<Record<Goal, SmartBanner>> = {
    "fat-loss": {
      title: "Metabolism boost",
      message: "Torch fat & energize — start the day with",
      emoji: "🔥",
      juiceName: "Pure Greens",
      juiceId: 19,
    },
    recovery: {
      title: "Muscle rebuild",
      message: "Rebuild & bounce back — power up with",
      emoji: "💪",
      juiceName: "Ruby Revive",
      juiceId: 9,
    },
    immunity: {
      title: "Immune shield",
      message: "Fortify your defense — daily shield with",
      emoji: "🛡️",
      juiceName: "Green Gold",
      juiceId: 2,
    },
  };

  return (
    banners[goal] || {
      title: "Goal Focus",
      message: `Keep pushing towards your ${goal} goals with`,
      emoji: "✨",
      juiceName: "Daily Greens",
      juiceId: 1,
    }
  );
}

export function getQuickRecommendation(need: "energy" | "recover" | "cleanse"): Product[] {
  const needMap: Record<string, string[]> = {
    energy: ["Energy", "Kick", "Vitamin C", "Stamina"],
    recover: ["Hydrate", "Antioxidant", "Refresh", "Protein"],
    cleanse: ["Detox", "Cleanse", "Balance", "Keto"],
  };
  const tags = needMap[need];
  return PRODUCTS.juices.filter((j) => tags.includes(j.tag)).slice(0, 2);
}

/**
 * Get personalized bundle suggestions based on goal and preferences
 */
export function getBundleSuggestions(goal: Goal): BundleSuggestion[] {
  const plan = getDailyJuicePlan(goal, false);

  const bundledJuices = [plan.morning.juice, plan.afternoon.juice, plan.evening.juice];
  const totalPrice = bundledJuices.reduce((sum, j) => sum + j.price, 0);
  const savedPrice = totalPrice * 0.15; // 15% bundle discount

  return [
    {
      juices: bundledJuices,
      bundleTitle: `3-Day ${goal === "fat-loss" ? "Fat Loss" : goal === "recovery" ? "Recovery" : "Immunity"} Bundle`,
      bundleDescription: `Personalized trio optimized for ${goal}. Drink one juice per time of day.`,
      bundlePrice: Math.round((totalPrice - savedPrice) * 100) / 100,
      savings: Math.round(savedPrice * 100) / 100,
    },
    {
      juices: PRODUCTS.juices.filter((j) => GOAL_TAGS[goal].includes(j.tag)).slice(0, 5),
      bundleTitle: `${goal === "fat-loss" ? "Fat Loss" : goal === "recovery" ? "Recovery" : "Immunity"} Starter Pack`,
      bundleDescription: `5-juice variety pack to find your perfect match for ${goal}.`,
      bundlePrice: 5,
      savings: 1,
    },
  ];
}

/**
 * Get alternative recommendations when user has preferences or restrictions
 */
export function getAlternativeRecommendations(
  goal: Goal,
  timeOfDay: TimeOfDay,
  exclusiveIngredients?: string[]
): Product[] {
  const juices = PRODUCTS.juices;
  const userPrefs = getUserPreferences();

  let filtered = juices;
  if (exclusiveIngredients && exclusiveIngredients.length > 0) {
    const exclusiveSet = new Set(exclusiveIngredients.map((i) => i.toLowerCase()));
    filtered = juices.filter((j) => !j.ingredients.some((i) => exclusiveSet.has(i.toLowerCase())));
  }

  const scored = filtered.map((juice) => ({
    juice,
    score: scoreJuice(juice, goal, false, timeOfDay, [], userPrefs),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.juice);
}

/**
 * Track user's favorite juice selections for future personalization
 */
export function addToFavorites(juiceId: number) {
  const prefs = getUserPreferences();
  if (!prefs.favoriteJuices.includes(juiceId)) {
    prefs.favoriteJuices.push(juiceId);
  }
  saveUserPreferences(prefs);
}

/**
 * Remove from favorites
 */
export function removeFromFavorites(juiceId: number) {
  const prefs = getUserPreferences();
  prefs.favoriteJuices = prefs.favoriteJuices.filter((id) => id !== juiceId);
  saveUserPreferences(prefs);
}
