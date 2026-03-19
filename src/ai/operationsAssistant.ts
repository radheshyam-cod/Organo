import type { UserContext } from "./recommendationEngine";
import type { UserHealthProfile } from "./nutritionAssistant";

// ============ TYPES & INTERFACES ============

export type AssistantFunction =
  | "personalized-plan"
  | "forecasting"
  | "smart-recommendation"
  | "unknown";

export interface AssistantRequest {
  userMessage?: string;
  context?: UserContext;
  healthProfile?: UserHealthProfile;
  intent?: AssistantFunction;
  timestamp?: number;
}

export interface AssistantResponse {
  function: AssistantFunction;
  confidence: number; // 0-100
  reasoning: string;
  recommendation: string;
  nextStep: {
    label: string;
    route: string;
    action: string;
  };
  relatedTools?: Array<{
    name: string;
    description: string;
    route: string;
  }>;
}

export interface WellnessMetrics {
  goal?: string;
  timeframe?: string;
  urgency?: "low" | "medium" | "high" | "critical";
  businessNeed?: "customer-experience" | "operations" | "sustainability";
}

// ============ INTENT DETECTION ============

const PLAN_KEYWORDS = [
  "plan",
  "diet",
  "nutrition",
  "meal",
  "daily",
  "week",
  "routine",
  "health",
  "goal",
  "fat loss",
  "recovery",
  "immunity",
  "energy",
  "detox",
  "personalized",
  "custom",
  "profile",
  "assessment",
];

const FORECAST_KEYWORDS = [
  "forecast",
  "demand",
  "predict",
  "supply",
  "inventory",
  "waste",
  "sourcing",
  "production",
  "ordering",
  "stock",
  "availability",
  "trends",
  "analysis",
  "business",
  "operations",
  "bulk",
  "wholesale",
];

const RECOMMEND_KEYWORDS = [
  "recommend",
  "suggest",
  "juice",
  "drink",
  "now",
  "today",
  "right now",
  "what should",
  "best",
  "quick",
  "immediate",
  "context",
  "workout",
  "tired",
  "stressed",
  "current",
  "real-time",
];

export function detectIntent(request: AssistantRequest): AssistantFunction {
  // If explicit intent provided
  if (request.intent) {
    return request.intent;
  }

  // If context signals are present, likely recommendation
  if (request.context && Object.keys(request.context).length > 0) {
    // Check for real-time signals
    if (
      request.context.workedOutToday ||
      request.context.sleepQuality ||
      request.context.stressLevel ||
      request.context.energyLevel
    ) {
      return "smart-recommendation";
    }
  }

  // If health profile is present, likely planning
  if (request.healthProfile && Object.keys(request.healthProfile).length > 0) {
    return "personalized-plan";
  }

  // Keyword-based detection
  if (request.userMessage) {
    const message = request.userMessage.toLowerCase();

    // Count keyword matches
    const planMatches = PLAN_KEYWORDS.filter((kw) => message.includes(kw)).length;
    const forecastMatches = FORECAST_KEYWORDS.filter((kw) => message.includes(kw)).length;
    const recommendMatches = RECOMMEND_KEYWORDS.filter((kw) => message.includes(kw)).length;

    const maxMatches = Math.max(planMatches, forecastMatches, recommendMatches);

    if (maxMatches === 0) {
      return "unknown";
    }

    if (planMatches === maxMatches && planMatches > 0) {
      return "personalized-plan";
    }
    if (forecastMatches === maxMatches && forecastMatches > 0) {
      return "forecasting";
    }
    if (recommendMatches === maxMatches && recommendMatches > 0) {
      return "smart-recommendation";
    }
  }

  return "unknown";
}

export function calculateIntentConfidence(
  request: AssistantRequest,
  intent: AssistantFunction
): number {
  let confidence = 50; // baseline

  // Explicit intent is most confident
  if (request.intent) {
    confidence += 40;
  }

  // Context-based confidence
  if (request.context && Object.keys(request.context).length > 0) {
    confidence += 15;
  }

  if (request.healthProfile && Object.keys(request.healthProfile).length > 0) {
    confidence += 15;
  }

  // Keyword match confidence
  if (request.userMessage) {
    const message = request.userMessage.toLowerCase();
    const keywordSets: Record<AssistantFunction, string[]> = {
      "personalized-plan": PLAN_KEYWORDS,
      forecasting: FORECAST_KEYWORDS,
      "smart-recommendation": RECOMMEND_KEYWORDS,
      unknown: [],
    };

    const matchCount = keywordSets[intent]?.filter((kw) => message.includes(kw)).length || 0;
    confidence += Math.min(20, matchCount * 3);
  }

  return Math.min(100, confidence);
}

// ============ RESPONSE GENERATION ============

export function generateAssistantResponse(request: AssistantRequest): AssistantResponse {
  const intent = detectIntent(request);
  const confidence = calculateIntentConfidence(request, intent);

  switch (intent) {
    case "personalized-plan":
      return generatePlanResponse(confidence);

    case "forecasting":
      return generateForecastingResponse(confidence);

    case "smart-recommendation":
      return generateRecommendationResponse(confidence);

    default:
      return generateUnknownResponse(confidence);
  }
}

function generatePlanResponse(confidence: number): AssistantResponse {
  return {
    function: "personalized-plan",
    confidence,
    reasoning:
      "You're looking to create a structured wellness plan with personalized nutrition recommendations based on your health profile, goals, and constraints.",
    recommendation:
      "The **Nutrition Assistant** will guide you through a comprehensive 7-step health assessment (demographics, fitness, health metrics, diet preferences, medical history) and then generate a customized daily juice plan with timing, safety notes, and meal pairings.",
    nextStep: {
      label: "Start Health Assessment",
      route: "/ai-advisor/nutrition-assistant",
      action: "Begin 7-step form to collect your health profile and generate personalized plans",
    },
    relatedTools: [
      {
        name: "Smart Recommender",
        description: "For real-time juice suggestions based on your current context",
        route: "/ai-advisor/recommender",
      },
      {
        name: "AI Advisor",
        description: "For personalized health tips beyond juice recommendations",
        route: "/ai-advisor",
      },
    ],
  };
}

function generateForecastingResponse(confidence: number): AssistantResponse {
  return {
    function: "forecasting",
    confidence,
    reasoning:
      "You're focused on business operations and sustainability—understanding demand patterns to optimize inventory, reduce waste, and improve sourcing efficiency.",
    recommendation:
      "The **Demand Intelligence Dashboard** analyzes historical sales, identifies high/low movers, flags waste risks, and provides sourcing recommendations. It includes inventory optimization strategies, price elasticity models, and smart bundle suggestions to maximize freshness and profitability.",
    nextStep: {
      label: "View Demand Report",
      route: "/ai-advisor/demand-forecasting",
      action: "Analyze this week's demand patterns, waste risks, and operational recommendations",
    },
    relatedTools: [
      {
        name: "AI Advisor",
        description: "For customer-facing health guidance to drive demand for specific juices",
        route: "/ai-advisor",
      },
    ],
  };
}

function generateRecommendationResponse(confidence: number): AssistantResponse {
  return {
    function: "smart-recommendation",
    confidence,
    reasoning:
      "You need an immediate, context-aware juice suggestion based on your current state—activity level, sleep quality, stress, time of day, and goals.",
    recommendation:
      "The **Real-Time Recommender** analyzes 20+ life signals (workout status, sleep quality, stress, weather, time of day, goals) and generates personalized suggestions with confidence scores. It explains why each juice fits your needs, when to drink it, and expected benefits.",
    nextStep: {
      label: "Get Personalized Suggestion",
      route: "/ai-advisor/recommender",
      action: "Toggle your current signals to get an instant juice recommendation",
    },
    relatedTools: [
      {
        name: "Nutrition Assistant",
        description: "For comprehensive daily planning based on full health profile",
        route: "/ai-advisor/nutrition-assistant",
      },
    ],
  };
}

function generateUnknownResponse(confidence: number): AssistantResponse {
  return {
    function: "unknown",
    confidence,
    reasoning:
      "Your request could potentially use multiple tools. Here's a breakdown to help you choose:",
    recommendation: `
**Use Nutrition Assistant if:** You want a structured daily plan, or are starting a wellness journey with health assessment.

**Use Demand Forecasting if:** You're managing inventory, reducing waste, or planning sourcing and production.

**Use Smart Recommender if:** You want an immediate juice suggestion based on your current activity, stress, sleep, or time of day.
    `,
    nextStep: {
      label: "Choose Your Path",
      route: "/ai-advisor",
      action: "Select the tool that best matches your current need",
    },
    relatedTools: [
      {
        name: "Nutrition Assistant",
        description: "Personalized 7-step health assessment and daily plans",
        route: "/ai-advisor/nutrition-assistant",
      },
      {
        name: "Smart Recommender",
        description: "Real-time suggestions based on current state",
        route: "/ai-advisor/recommender",
      },
      {
        name: "Demand Forecasting",
        description: "Inventory optimization and waste reduction",
        route: "/ai-advisor/demand-forecasting",
      },
    ],
  };
}

// ============ GUIDANCE & BEST PRACTICES ============

export interface ToolGuidance {
  tool: AssistantFunction;
  useCases: string[];
  timeframe: string;
  businessValue: string;
  outputFormat: string;
  integrations: string[];
}

export const TOOL_GUIDANCE: Record<AssistantFunction, ToolGuidance> = {
  "personalized-plan": {
    tool: "personalized-plan",
    useCases: [
      "Creating structured wellness routines",
      "Supporting fitness goals (fat loss, recovery, immunity)",
      "Planning around medical restrictions or allergies",
      "Generating meal pairing suggestions",
      "Educating customers on optimal juice timing",
    ],
    timeframe: "Daily to weekly plans",
    businessValue:
      "Higher customer satisfaction, retention, repeat purchases through personalization",
    outputFormat:
      "Multi-step form → Health profile assessment → Customized daily plan with timing, benefits, safety notes, and meal suggestions",
    integrations: [
      "Shopping cart (one-click purchase of recommended juices)",
      "Order history (personalized based on past preferences)",
    ],
  },
  forecasting: {
    tool: "forecasting",
    useCases: [
      "Reducing waste and spoilage",
      "Optimizing production schedules",
      "Informing inventory purchasing decisions",
      "Identifying trending vs. slow-moving juices",
      "Planning seasonal promotions",
      "Improving supplier coordination",
    ],
    timeframe: "Weekly to quarterly planning",
    businessValue:
      "Reduced waste (cost savings), improved freshness, better margins, optimized sourcing",
    outputFormat:
      "7 detailed dashboard views: Overview, Full Forecast Table, Waste Risk Alerts, Ingredient Sourcing, Price Optimization, Inventory Recommendations, Smart Bundles",
    integrations: [
      "Recommendations engine (suggests high-demand bundles)",
      "Supply chain management (sourcing prioritization)",
    ],
  },
  "smart-recommendation": {
    tool: "smart-recommendation",
    useCases: [
      "Immediate personalized juice suggestions",
      'Real-time customer support ("What should I drink now?")',
      "Post-workout hydration guidance",
      "Stress/sleep recovery support",
      "Weather-appropriate hydration",
      "Driving impulse purchases at point of sale",
    ],
    timeframe: "Instant recommendations (seconds)",
    businessValue:
      "Increased conversions, higher average order value, improved customer satisfaction, real-time personalization",
    outputFormat:
      "Interactive context input → Instant suggestion with: trigger, reasoning, best time, expected benefit, alternative option, confidence score",
    integrations: [
      "Checkout flow (contextual pre-purchase recommendations)",
      "Shopping cart (one-click add)",
      "Weekly planning (generates 7-day recommendations)",
    ],
  },
  unknown: {
    tool: "unknown",
    useCases: ["Determining which tool best fits your need"],
    timeframe: "Decision time: < 1 minute",
    businessValue: "Routes customers/teams to right tool for maximum value",
    outputFormat: "Guidance comparison matrix with decision tree",
    integrations: ["All three tools"],
  },
};

// ============ DECISION FRAMEWORK ============

export interface DecisionContext {
  userType: "customer" | "operations" | "admin";
  goal: string;
  urgency: "immediate" | "short-term" | "strategic";
  context?: string;
}

export function recommendTool(decision: DecisionContext): AssistantFunction {
  const { userType, goal, urgency } = decision;

  // Customer context
  if (userType === "customer") {
    if (urgency === "immediate") {
      return "smart-recommendation"; // "What should I drink RIGHT NOW?"
    }
    if (goal.includes("plan") || goal.includes("wellness") || goal.includes("routine")) {
      return "personalized-plan"; // "I want a wellness routine"
    }
    if (goal.includes("suggest") || goal.includes("recommend")) {
      return "smart-recommendation"; // "What do you suggest?"
    }
  }

  // Operations context
  if (userType === "operations") {
    if (goal.includes("waste") || goal.includes("inventory") || goal.includes("forecast")) {
      return "forecasting"; // Demand & waste reduction
    }
    if (goal.includes("sourcing") || goal.includes("production")) {
      return "forecasting"; // Supply chain optimization
    }
  }

  // Admin context
  if (userType === "admin") {
    if (goal.includes("customer") || goal.includes("engagement")) {
      return "smart-recommendation";
    }
    if (goal.includes("business") || goal.includes("operations")) {
      return "forecasting";
    }
  }

  return "unknown";
}

// ============ HELP & DOCUMENTATION ============

export const HELP_ARTICLES: Record<string, string> = {
  "getting-started":
    "Welcome to Organo Wellness Operations! Choose one of three AI-powered tools to get started.",
  "personalized-plan":
    "Enter your health metrics, goals, and preferences to receive a customized daily juice plan with timing, benefits, and meal pairings.",
  forecasting:
    "Analyze demand trends, identify waste risks, and get sourcing recommendations to optimize inventory and reduce spoilage.",
  "smart-recommendation":
    "Answer quick context questions (sleep, workout, stress, time of day) for instant personalized juice suggestions.",
  "safety-first":
    "All recommendations respect allergies, medical conditions, and medications. Always consult doctors for serious health concerns.",
  "freshness-priority":
    "Our forecasting engine prioritizes freshness by identifying slow movers early and suggesting strategic bundling or promotions.",
  "waste-reduction":
    "Smart demand forecasting can reduce product waste by 20-30% by aligning production with real customer consumption patterns.",
};
