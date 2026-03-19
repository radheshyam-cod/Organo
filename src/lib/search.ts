import { PRODUCTS, type Category } from "../data/products";

export type SearchResultKind = "product" | "page";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  to: string;
  kind: SearchResultKind;
  section: string;
  badge?: string;
  image?: string;
  priceLabel?: string;
}

interface SearchDocument extends SearchResult {
  searchableText: string;
}

export const FEATURED_SEARCHES = [
  "detox",
  "mango",
  "greens",
  "subscription",
  "availability",
  "ai advisor",
];

const CATEGORY_LABELS: Record<Category, string> = {
  juices: "Juice",
  vegetables: "Vegetable",
  fruits: "Fruit",
};

const PAGE_RESULTS: SearchDocument[] = [
  {
    id: "page-shop",
    title: "Shop",
    description: "Browse the full harvest of juices, fruits, and vegetables.",
    to: "/shop",
    kind: "page",
    section: "Page",
    badge: "Catalog",
    searchableText: "shop harvest catalog juices fruits vegetables fresh products bottles",
  },
  {
    id: "page-subscription",
    title: "Subscription",
    description: "Build a recurring routine with curated juice deliveries.",
    to: "/subscription",
    kind: "page",
    section: "Page",
    badge: "Routine",
    searchableText: "subscription weekly recurring membership delivery juice plan routine",
  },
  {
    id: "page-check-availability",
    title: "Check Availability",
    description: "See whether local delivery is available for your zip code.",
    to: "/check-availability",
    kind: "page",
    section: "Page",
    badge: "Delivery",
    searchableText: "check availability delivery zip code local national shipping area",
  },
  {
    id: "page-the-farm",
    title: "The Farm",
    description: "Meet the growers and explore the story behind Organo.",
    to: "/the-farm",
    kind: "page",
    section: "Page",
    badge: "Story",
    searchableText: "farm growers founder story harvest fields land organo",
  },
  {
    id: "page-practices",
    title: "Our Practices",
    description: "Learn how Organo grows, presses, and delivers with care.",
    to: "/practices",
    kind: "page",
    section: "Page",
    badge: "Standards",
    searchableText: "practices organic regenerative farming cold pressed standards sustainability",
  },
  {
    id: "page-visit",
    title: "Visit Us",
    description: "Plan a pickup, tasting, or farm experience.",
    to: "/visit",
    kind: "page",
    section: "Page",
    badge: "Experience",
    searchableText: "visit tasting pickup tour farm experience map location",
  },
  {
    id: "page-wholesale",
    title: "Wholesale",
    description: "Stock cafes, studios, and stores with fresh Organo products.",
    to: "/wholesale",
    kind: "page",
    section: "Page",
    badge: "Business",
    searchableText: "wholesale bulk cafe studio retail business orders",
  },
  {
    id: "page-ai-advisor",
    title: "AI Advisor",
    description: "Get personalized recommendations based on your goals.",
    to: "/ai-advisor",
    kind: "page",
    section: "AI Tool",
    badge: "Wellness",
    searchableText: "ai advisor wellness recommendation personalized goals health juice assistant",
  },
  {
    id: "page-wellness-center",
    title: "Wellness Hub",
    description: "Review wellness insights and operations together in one place.",
    to: "/wellness-center",
    kind: "page",
    section: "AI Tool",
    badge: "Hub",
    searchableText: "wellness hub operations center dashboard insights ai",
  },
  {
    id: "page-recommender",
    title: "Recommender",
    description: "Find the best-fit blend for the moment.",
    to: "/recommender",
    kind: "page",
    section: "AI Tool",
    badge: "Recommendations",
    searchableText: "recommender recommendations best fit juice suggestions ai",
  },
  {
    id: "page-nutrition-assistant",
    title: "Nutrition Assistant",
    description: "Explore ingredients, benefits, and nutrition guidance.",
    to: "/nutrition-assistant",
    kind: "page",
    section: "AI Tool",
    badge: "Nutrition",
    searchableText: "nutrition assistant ingredients benefits diet help ai",
  },
  {
    id: "page-demand-forecasting",
    title: "Demand Forecasting",
    description: "Predict sourcing and inventory needs with smarter signals.",
    to: "/demand-forecasting",
    kind: "page",
    section: "AI Tool",
    badge: "Forecasting",
    searchableText: "demand forecasting inventory sourcing predictions ai operations",
  },
];

const PRODUCT_RESULTS: SearchDocument[] = Object.entries(PRODUCTS).flatMap(([category, products]) =>
  products.map((product) => {
    const section = CATEGORY_LABELS[category as Category];

    return {
      id: `product-${product.id}`,
      title: product.name,
      description: product.description,
      to: `/product/${product.id}`,
      kind: "product",
      section,
      badge: product.tag,
      image: product.image,
      priceLabel: `₹${product.price} / ${product.measurement}`,
      searchableText: [
        product.name,
        product.description,
        product.tag,
        section,
        product.ingredients.join(" "),
        product.benefits.join(" "),
      ]
        .join(" ")
        .toLowerCase(),
    };
  })
);

const SEARCH_INDEX: SearchDocument[] = [...PAGE_RESULTS, ...PRODUCT_RESULTS];

const scoreSearchResult = (item: SearchDocument, normalizedQuery: string, terms: string[]) => {
  let score = 0;
  const title = item.title.toLowerCase();
  const section = item.section.toLowerCase();
  const badge = item.badge?.toLowerCase() ?? "";
  const description = item.description.toLowerCase();

  if (title === normalizedQuery) score += 160;
  if (title.startsWith(normalizedQuery)) score += 120;
  if (title.includes(normalizedQuery)) score += 90;
  if (badge.includes(normalizedQuery)) score += 40;
  if (section.includes(normalizedQuery)) score += 30;
  if (description.includes(normalizedQuery)) score += 20;

  let matchedTerms = 0;
  for (const term of terms) {
    let matched = false;

    if (title.includes(term)) {
      score += 28;
      matched = true;
    }
    if (badge.includes(term)) {
      score += 16;
      matched = true;
    }
    if (section.includes(term)) {
      score += 14;
      matched = true;
    }
    if (description.includes(term)) {
      score += 8;
      matched = true;
    }
    if (item.searchableText.includes(term)) {
      score += 6;
      matched = true;
    }

    if (matched) matchedTerms += 1;
  }

  if (terms.length > 1 && matchedTerms === terms.length) score += 24;
  if (item.kind === "product") score += 4;

  return score;
};

export const searchSite = (query: string, limit = 8): SearchResult[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return SEARCH_INDEX.map((item) => ({
    item,
    score: scoreSearchResult(item, normalizedQuery, terms),
  }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.item.title.localeCompare(right.item.title);
    })
    .slice(0, limit)
    .map(({ item }) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      to: item.to,
      kind: item.kind,
      section: item.section,
      badge: item.badge,
      image: item.image,
      priceLabel: item.priceLabel,
    }));
};
