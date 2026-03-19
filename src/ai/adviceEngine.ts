import type { Goal, TimeOfDay } from "./juiceAdvisor";

export interface HealthAdvice {
  title: string;
  description: string;
  icon: string;
  category: "nutrition" | "lifestyle" | "hydration" | "timing" | "exercise" | "recovery";
  tips: string[];
  actionable: boolean;
}

export interface DailyAdvicePack {
  mainAdvice: HealthAdvice;
  tips: HealthAdvice[];
  hydrationTip: string;
  timingTip: string;
  motivationalMessage: string;
}

// Goal-specific advice
const GOAL_ADVICE: Partial<Record<
  Goal,
  {
    nutrition: string[];
    lifestyle: string[];
    hydration: string[];
    exercise: string[];
  }
>> = {
  "fat-loss": {
    nutrition: [
      "Drink juices 30 minutes before meals to help you feel fuller and eat less",
      "Combine your juice with protein-rich foods to maintain muscle during fat loss",
      "Stay consistent with timing — morning juices boost metabolism naturally",
      "Avoid eating heavy carbs directly after evening juices",
      "Include high-fiber juices in your plan to support digestive health",
    ],
    lifestyle: [
      "Track your daily juice intake to stay accountable to your goals",
      "Create a consistent morning routine with your juice — builds discipline",
      "Sleep 7-8 hours for optimal metabolism and fat loss results",
      "Manage stress through juice rituals — they are your mindful moments",
      "Weigh yourself weekly, not daily — focus on trends, not fluctuations",
    ],
    hydration: [
      "Drink at least 3-4L of water daily alongside your juices for better detox",
      "Fresh juices replace fluids, but add extra water between meals",
      "Morning hydration with lemon juice boosts metabolism by 30%",
      "Herbal teas count toward hydration on non-juice hours",
      "Coconut water pairs well with detox juices for electrolyte balance",
    ],
    exercise: [
      "Pair your juice plan with 150 minutes of cardio per week for maximum results",
      "Light strength training (2-3x/week) preserves muscle during fat loss",
      "Post-workout juice within 30 minutes accelerates recovery",
      "Morning workouts + juice boost morning metabolism significantly",
      "HIIT workouts combined with detox juices amplify fat-burning effects",
    ],
  },
  recovery: {
    nutrition: [
      "Drink protein-rich juices within 30 minutes post-workout for optimal recovery",
      "Pair juices with carbs (banana, oats) to replenish glycogen stores",
      "Include anti-inflammatory juices to reduce muscle soreness",
      "Afternoon juice provides sustained energy for evening training",
      "Evening juice with natural melatonin supports overnight recovery",
    ],
    lifestyle: [
      "Recovery includes rest days — use juices but focus on relaxation",
      "Massage + juice ritual accelerates muscle repair and tension release",
      "Stretching routines + hydrating juices reduce DOMS (muscle soreness)",
      "Track your energy levels daily — adjust juice timing if needed",
      "Social recovery matters — enjoy your juices mindfully with others",
    ],
    hydration: [
      "Drink 1L water per 30 minutes of intense exercise for full recovery",
      "Electrolyte-rich juices replace minerals lost during sweating",
      "Hydrate continuously, not all at once — sip throughout the day",
      "Morning hydration (500ml) jumpstarts recovery metabolism",
      "Beet juices + water = optimal oxygen delivery to muscles",
    ],
    exercise: [
      "Combine juices with progressive overload strength training",
      "3-4 days of strength training + juice support builds muscle fast",
      "Active recovery on off-days (yoga, walking) + juices speeds healing",
      "Periodize your training: heavy weeks pair with recovery juices",
      "Post-workout stretching + juice creates synergistic recovery effect",
    ],
  },
  immunity: {
    nutrition: [
      "Vitamin C juices taken daily strengthen immune response significantly",
      "Zinc, selenium, and antioxidants in juices support T-cell function",
      "Consume immunity juices with fats (avocado, nuts) for better absorption",
      "Consistent juice intake matters more than sporadic use",
      "Rainbow variety (different juice colors) = broader immune coverage",
    ],
    lifestyle: [
      "Sleep consistency (same bedtime) + immunity juices = stronger immunity",
      "Manage stress with meditation + juice rituals — stress weakens immunity",
      "Limit alcohol and processed foods — they compete with juice benefits",
      "Seasonal juice rotation (winter citrus, summer berries) aligns with seasons",
      "Regular health checkups + juice protocol ensures you stay ahead",
    ],
    hydration: [
      "Hydration is immunity's best friend — drink 2-3L alongside juices daily",
      "Warm immunity juices in winter improve lymphatic circulation",
      "Herbal tea between juice sessions boosts immune compounds further",
      "Morning hydration with lemon juice starts immune activation",
      "Consistent hydration prevents dehydration-induced immune suppression",
    ],
    exercise: [
      "Moderate exercise (30 min walks, light yoga) + juices optimizes immunity",
      "Avoid over-training — it suppresses immunity; balance with juices",
      "Post-exercise immunity juices prevent exercise-induced illness",
      "Seasonal training adjustments + juice shifts support year-round wellness",
      "Mind-body practices (tai chi, pilates) + juices amplify immune benefits",
    ],
  },
};

// Time-of-day specific advice
const TIME_ADVICE: Record<TimeOfDay, string> = {
  morning:
    "Drink on an empty stomach for maximum nutrient absorption. The morning is peak absorption time — take advantage of it.",
  afternoon:
    "Mid-day juice acts as a sustained energy boost. Avoid heavy meals 1 hour before or after for optimal digestion.",
  evening:
    "Evening juice supports overnight recovery and sleep quality. Lighter juices (cooling ingredients) are ideal before bed.",
};

// Main advice by goal
const MAIN_ADVICE: Partial<Record<Goal, HealthAdvice>> = {
  "fat-loss": {
    title: "Strategic Juice Timing Accelerates Fat Loss",
    description:
      "Timing your juices around meals and workouts maximizes their metabolic impact. Morning juices boost your resting metabolic rate, setting a strong foundation for the day.",
    icon: "🔥",
    category: "timing",
    tips: [
      "Drink morning juice 30 min before breakfast to prime metabolism",
      "Afternoon juice prevents energy crashes and cravings",
      "Evening juice supports overnight fat metabolism during sleep",
      "Combine juices with strength training for synergistic fat loss",
    ],
    actionable: true,
  },
  recovery: {
    title: "Nutrient Timing is Your Recovery Secret Weapon",
    description:
      "Your muscles need the right nutrients at the right time. Post-workout juice delivery within 30 minutes creates an optimal anabolic window for muscle repair and growth.",
    icon: "💪",
    category: "recovery",
    tips: [
      "Post-workout juice speeds glycogen replenishment by 40%",
      "Protein + carbs in juice combo optimizes muscle protein synthesis",
      "Consistent juice timing creates compound recovery benefits",
      "Track your soreness levels — adjust juice timing if needed",
    ],
    actionable: true,
  },
  immunity: {
    title: "Consistency is the Key to Immune Strength",
    description:
      "Your immune system thrives on consistency. Daily juice intake builds up immune compounds in your body, creating a protective shield against seasonal threats.",
    icon: "🛡️",
    category: "nutrition",
    tips: [
      "Daily immunity juices reduce cold/flu risk by up to 50%",
      "Vitamin C accumulation requires 2-4 weeks of consistent intake",
      "Combine juices with sleep and stress management for maximum effect",
      "Winter months: increase juice intake as immunity baseline drops",
    ],
    actionable: true,
  },
};

// Supporting tips by goal
const SUPPORTING_TIPS: Partial<Record<Goal, HealthAdvice[]>> = {
  "fat-loss": [
    {
      title: "Sleep Quality Amplifies Fat Loss",
      description:
        "Poor sleep sabotages fat loss goals by increasing cortisol and craving intensity. Pair evening juices with consistent sleep schedules.",
      icon: "😴",
      category: "lifestyle",
      tips: [
        "Sleep 7-9 hours nightly",
        "Evening juice calms nervous system",
        "Consistent bedtime regulates metabolism",
      ],
      actionable: true,
    },
    {
      title: "Strength Training Preserves Muscle",
      description:
        "During fat loss, muscle loss is the enemy. Strength training + recovery juices preserve lean mass while burning fat.",
      icon: "💪",
      category: "exercise",
      tips: [
        "2-3x weekly strength sessions",
        "Post-workout juice within 30 min",
        "Progressive overload prevents adaptation plateaus",
      ],
      actionable: true,
    },
    {
      title: "Hydration Accelerates Metabolism",
      description:
        "Water increases calorie burn through thermogenesis. Combine juices with consistent hydration for synergistic fat loss.",
      icon: "💧",
      category: "hydration",
      tips: ["Drink 3-4L daily", "Water before juices", "Warm lemon water speeds metabolism"],
      actionable: true,
    },
  ],
  recovery: [
    {
      title: "Anti-Inflammatory Foods Reduce Soreness",
      description:
        "DOMS (delayed onset muscle soreness) is reduced by 30% with anti-inflammatory juice intake + proper nutrition.",
      icon: "🌿",
      category: "nutrition",
      tips: [
        "Beet juice reduces inflammation by 25%",
        "Turmeric-based juices support healing",
        "Combine with protein-rich meals",
      ],
      actionable: true,
    },
    {
      title: "Active Recovery Accelerates Progress",
      description:
        'Rest days aren\'t "do nothing" days. Light mobility work + recovery juices prepare your body for the next training session.',
      icon: "🧘",
      category: "lifestyle",
      tips: [
        "Yoga or stretching 20-30 min",
        "Juice rituals become recovery meditation",
        "Foam rolling + juice amplify benefits",
      ],
      actionable: true,
    },
    {
      title: "Sleep Architecture Matters for Gains",
      description:
        "Deep sleep (stages 3-4) is where muscle growth happens. Evening juices support sleep quality for optimal recovery.",
      icon: "🌙",
      category: "lifestyle",
      tips: [
        "Target 7-9 hours nightly",
        "Evening juice 1-2 hours before bed",
        "Cool, dark bedroom optimizes sleep depth",
      ],
      actionable: true,
    },
  ],
  immunity: [
    {
      title: "Stress Management Strengthens Immunity",
      description:
        "Chronic stress suppresses immune function by 40%. Juice rituals + stress management create a powerful immune barrier.",
      icon: "🧠",
      category: "lifestyle",
      tips: [
        "10-15 min daily meditation",
        "Juice as mindful ritual",
        "Deep breathing before juice consumption",
      ],
      actionable: true,
    },
    {
      title: "Gut Health is Immune System HQ",
      description:
        "70% of immune cells live in your gut. Juice intake supports beneficial bacteria growth and immune signaling.",
      icon: "🦠",
      category: "nutrition",
      tips: [
        "Fermented foods support gut bacteria",
        "Fiber-rich juices feed good bacteria",
        "Probiotics + juice enhance immunity",
      ],
      actionable: true,
    },
    {
      title: "Movement Boosts Lymphatic Flow",
      description:
        "Your lymphatic system has no pump — movement is essential. Daily activity + juices optimize immune circulation.",
      icon: "🚶",
      category: "exercise",
      tips: [
        "30-min daily walks improve immunity",
        "Yoga enhances lymphatic drainage",
        "Combination with juice maximizes benefit",
      ],
      actionable: true,
    },
  ],
};

/**
 * Get personalized health advice pack based on goal
 */
export function getHealthAdvicePack(
  goal: Goal,
  timeOfDay: TimeOfDay,
  workedOut: boolean = false
): DailyAdvicePack {
  const mainAdvice = MAIN_ADVICE[goal] || {
    title: "Stay Consistent for Results",
    description: `Keep working towards your ${goal} goals with daily dedication.`,
    icon: "🌟",
    category: "nutrition",
    tips: ["Drink your juice daily", "Stay active"],
    actionable: true,
  };
  const supportingTips = SUPPORTING_TIPS[goal] || [];

  // Select 2 most relevant tips based on context
  let relevantTips = [...supportingTips];
  if (workedOut && goal === "recovery") {
    // Recovery tips are extra relevant post-workout
    relevantTips = supportingTips
      .filter((t) => t.category === "recovery")
      .concat(supportingTips.filter((t) => t.category !== "recovery"));
  }

  const goalAdviceObj = GOAL_ADVICE[goal];
  const hydrationTip = goalAdviceObj
    ? goalAdviceObj.hydration[Math.floor(Math.random() * goalAdviceObj.hydration.length)]
    : "Stay hydrated throughout the day.";
  const timingTip = TIME_ADVICE[timeOfDay];

  const motivationalMessages: Partial<Record<Goal, string[]>> = {
    "fat-loss": [
      "🔥 Every juice brings you closer to your lean goal. Stay consistent!",
      "💪 Fat loss is a marathon, not a sprint. Trust the process.",
      "⚡ Your metabolism is working hard. Fuel it with intention.",
    ],
    recovery: [
      "🏆 Every juice you drink speeds your muscle recovery. Champions recover like this.",
      "💯 Your body is rebuilding stronger. Respect the process.",
      "⚡ Post-workout recovery juice = faster gains. Drink up!",
    ],
    immunity: [
      "🛡️ Every juice strengthens your immune shield. Consistency is power.",
      "💪 You're building an immune fortress. One juice at a time.",
      "✨ Your body is your best investment. Protect it daily.",
    ],
  };

  const motivations = motivationalMessages[goal] || ["Keep going!", "You got this!", "Stay strong!"];
  const motivationalMessage = workedOut
    ? motivations[1]
    : timeOfDay === "morning"
      ? motivations[0]
      : motivations[2];

  return {
    mainAdvice,
    tips: relevantTips.slice(0, 2),
    hydrationTip,
    timingTip,
    motivationalMessage,
  };
}

/**
 * Get specific tips for the user's goal
 */
export function getGoalSpecificTips(
  goal: Goal,
  category?: "nutrition" | "lifestyle" | "hydration" | "exercise"
): string[] {
  const allTips = GOAL_ADVICE[goal] || {
    nutrition: ["Eat whole foods"],
    lifestyle: ["Sleep 8 hours"],
    hydration: ["Drink water"],
    exercise: ["Move daily"],
  };

  if (category) {
    return allTips[category] || [];
  }

  // Return random mix of all categories
  const categoriesArray = Object.values(allTips).flat();
  return categoriesArray.sort(() => Math.random() - 0.5).slice(0, 5);
}

/**
 * Get pre/post workout advice
 */
export function getWorkoutAdvice(_goal: Goal, isPreWorkout: boolean): HealthAdvice {
  if (isPreWorkout) {
    return {
      title: "Pre-Workout Fuel: 30-60 Minutes Before",
      description:
        "Energy juices 30-60 minutes before workout provide carbs for performance without digestive distress.",
      icon: "⚡",
      category: "exercise",
      tips: [
        "Light juice + water 45 min before workout",
        "High-carb juices boost performance by 15-20%",
        "Avoid heavy meals — juice provides quick energy",
        "Hydrate well — combined juice and water intake optimizes performance",
      ],
      actionable: true,
    };
  } else {
    return {
      title: "Post-Workout Recovery: Within 30 Minutes",
      description:
        "Your muscles are primed for nutrient absorption. This 30-minute window is critical for optimal recovery.",
      icon: "💪",
      category: "recovery",
      tips: [
        "Post-workout juice closes the anabolic window",
        "Protein + carbs in juice combo = 2x muscle protein synthesis",
        "Electrolyte replenishment prevents cramping",
        "Hydration supports nutrient delivery to muscles",
      ],
      actionable: true,
    };
  }
}

/**
 * Get quick daily tips rotation
 */
export function getDailyQuickTips(goal: Goal): string[] {
  const allTips = GOAL_ADVICE[goal] || {
    nutrition: ["Eat whole foods"],
    lifestyle: ["Sleep 8 hours"],
    hydration: ["Drink water"],
    exercise: ["Move daily"],
  };
  const randomTips = [
    ...allTips.nutrition.slice(0, 1),
    ...allTips.lifestyle.slice(0, 1),
    ...allTips.hydration.slice(0, 1),
    ...allTips.exercise.slice(0, 1),
  ];

  return randomTips.sort(() => Math.random() - 0.5);
}
