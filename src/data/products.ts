export type Category = "juices" | "vegetables" | "fruits";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  tag: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  measurement: string;
}

export const PRODUCTS: Record<Category, Product[]> = {
  juices: [
    {
      id: 1,
      name: "Root Radiance",
      price: 120,
      image: "/images/root_radiance.png",
      tag: "Detox",
      description:
        "A grounding blend of earth’s most potent detoxifiers. This deep red elixir flushes out toxins while boosting blood flow. The cayene kick ignites metabolism, while beet adds a natural sweetness that balances the earthy turmeric.",
      ingredients: ["Beet", "Carrot", "Ginger", "Turmeric", "Cayenne", "Lemon"],
      benefits: ["Liver support", "Anti-inflammatory", "Improved circulation", "Metabolism boost"],
      measurement: "500ml",
    },
    {
      id: 2,
      name: "Green Gold",
      price: 120,
      image: "/images/green_gold.png",
      tag: "Immunity",
      description:
        "Liquid sunshine for your cells. Packed with more greens than a salad, this bottle delivers a massive dose of chlorophyll and alkalizing minerals. It’s a daily shield for your immune system.",
      ingredients: ["Kate", "Spinach", "Cucumber", "Celery", "Green Apple", "Lemon", "Parsley"],
      benefits: ["Alkalizing", "Immune defense", "Skin clarity", "Energy lift without caffeine"],
      measurement: "500ml",
    },
    {
      id: 3,
      name: "Citrus Sun",
      price: 110,
      image: "/images/citrus_sun.png",
      tag: "Energy",
      description:
        "A bright, zesty wake-up call. We blend three types of citrus with a hint of mint for refreshing hydration. High in Vitamin C, it strengthens collagen and fights off fatigue.",
      ingredients: ["Orange", "Grapefruit", "Lemon", "Mint", "Pineapple"],
      benefits: ["Vitamin C mega-dose", "Collagen production", "Mood booster", "Hydration"],
      measurement: "500ml",
    },
    {
      id: 7,
      name: "Emerald Hydration",
      price: 100,
      image: "/images/emerald_hydration.png",
      tag: "Hydrate",
      description:
        "Pure, hydrating refreshment. Crisp cucumber and cooling melon meet a splash of aloe vera for the ultimate thirst quencher. Perfect post-workout or after a day in the sun.",
      ingredients: ["Cucumber", "Honeydew", "Aloe Vera", "Lime", "Coconut Water"],
      benefits: ["Deep hydration", "Skin soothing", "Electrolyte replenishment", "Cooling"],
      measurement: "500ml",
    },
    {
      id: 8,
      name: "Midnight Detox",
      price: 110,
      image: "/images/midnight_detox.png",
      tag: "Cleanse",
      description:
        "Activated charcoal binds to toxins, aiding their elimination from the body. Paired with alkaline water and lemon, it’s a reset button for your digestion.",
      ingredients: ["Activated Charcoal", "Alkaline Water", "Lemon", "Agave", "Himalayan Salt"],
      benefits: ["Digestive reset", "Toxin absorption", "Bloating relief", "Hangover helper"],
      measurement: "500ml",
    },
    {
      id: 9,
      name: "Ruby Revive",
      price: 110,
      image: "/images/ruby_revive.png",
      tag: "Hydrate",
      description:
        "A vibrant burst of antioxidants. Pomegranate and watermelon work together to hydrate and protect cells from oxidative stress. A sweet, refreshing treat.",
      ingredients: ["Watermelon", "Pomegranate", "Lime", "Mint"],
      benefits: ["Antioxidant rich", "Muscle recovery", "Heart health", "Hydration"],
      measurement: "500ml",
    },
    {
      id: 10,
      name: "Golden Glow",
      price: 120,
      image: "/images/golden_glow.png",
      tag: "Glow",
      description:
        "Beauty in a bottle. Carrot brings beta-carotene, while turmeric fights inflammation. A dash of black pepper increases nutrient absorption significantly.",
      ingredients: ["Carrot", "Orange", "Turmeric", "Ginger", "Black Pepper"],
      benefits: ["Skin radiance", "Anti-aging", "Vision support", "Anti-inflammatory"],
      measurement: "500ml",
    },
    {
      id: 11,
      name: "Sapphire Sky",
      price: 130,
      image: "/images/sapphire_sky.png",
      tag: "Brain",
      description:
        "Blue majik spirulina gives this juice its stunning color and brain-boosting power. Combined with coconut milk for healthy fats, it’s focus food.",
      ingredients: ["Blue Majik Spirulina", "Coconut Milk", "Banana", "Vanilla", "Dates"],
      benefits: ["Mental clarity", "Focus", "Healthy fats", "Antioxidant boost"],
      measurement: "500ml",
    },
    {
      id: 14,
      name: "Sunset Spice",
      price: 110,
      image: "/images/sunset_spice.png",
      tag: "Immunity",
      description:
        "A warming blend of carrot and ginger with a hint of crisp apple. Perfect for chilly mornings or whenever you need an immunity boost from within.",
      ingredients: ["Carrot", "Red Apple", "Ginger", "Lemon"],
      benefits: ["Immune support", "Digestion aid", "Anti-inflammatory", "Vitamin A rich"],
      measurement: "500ml",
    },
    {
      id: 15,
      name: "Berry Blast",
      price: 130,
      image: "/images/berry_blast.png",
      tag: "Antioxidant",
      description:
        "Antioxidant powerhouse. A dense, rich blend of forest berries with a citrus twist. Protects your cells and tastes like liquid jam.",
      ingredients: ["Strawberry", "Blueberry", "Raspberry", "Red Apple", "Lime"],
      benefits: ["Cell protection", "Skin health", "Heart health", "Brain function"],
      measurement: "500ml",
    },
    {
      id: 16,
      name: "Celery Calm",
      price: 100,
      image: "/images/celery_calm.png",
      tag: "Balance",
      description:
        "Pure, mineral-rich hydration. Just celery and a squeeze of lemon. Known for its ability to lower blood pressure and calm the nervous system.",
      ingredients: ["Celery", "Lemon"],
      benefits: ["Alkalizing", "Lower blood pressure", "Gut health", "Anti-inflammatory"],
      measurement: "500ml",
    },
    {
      id: 17,
      name: "Tropical Twist",
      price: 120,
      image: "/images/tropical_twist.png",
      tag: "Vitamin C",
      description:
        "A vacation in a bottle. Sun-ripened pineapple and passion fruit bring the tropics to you, while boosting your immune system with massive Vitamin C.",
      ingredients: ["Pineapple", "Passion Fruit", "Orange", "Turmeric"],
      benefits: ["Immunity", "Enzyme rich", "Digestion", "Mood booster"],
      measurement: "500ml",
    },
    {
      id: 18,
      name: "Beet It",
      price: 110,
      image: "/images/beet_it.png",
      tag: "Stamina",
      description:
        "The athlete’s choice. Simple and potent. Beet juice is scientifically proven to improve blood flow and endurance during exercise.",
      ingredients: ["Beet", "Apple", "Lemon"],
      benefits: ["Athletic performance", "Lower blood pressure", "Liver health", "Stamina"],
      measurement: "500ml",
    },
    {
      id: 19,
      name: "Pure Greens",
      price: 130,
      image: "/images/pure_greens.png",
      tag: "Keto",
      description:
        "No fruit, just serious greens. For the hardcore health enthusiast. Packed with phytonutrients and zero sugar. The ultimate alkaline reset.",
      ingredients: ["Kale", "Spinach", "Cucumber", "Celery", "Parsley", "Lemon", "Ginger"],
      benefits: ["Zero sugar", "Deep alkalizing", "Detox", "Skin health"],
      measurement: "500ml",
    },
    {
      id: 20,
      name: "Ginger Shot",
      price: 60,
      image: "/images/ginger_shot.png",
      tag: "Kick",
      description:
        "Small but mighty. A concentrated hit of spicy ginger to wake up your system, clear your sinuses, and fire up digestion.",
      ingredients: ["Ginger", "Lemon", "Cayenne"],
      benefits: ["Nausea relief", "Digestion", "Immunity", "Circulation"],
      measurement: "100ml",
    },
    {
      id: 21,
      name: "Watermelon Hydrate",
      price: 110,
      image: "/images/watermelon_hydrate.png",
      tag: "Refresh",
      description:
        "Summer in a bottle, available all year. Ultra-hydrating watermelon with cooling mint. High in lycopene and essential electrolytes.",
      ingredients: ["Watermelon", "Mint", "Lime"],
      benefits: ["Hydration", "Muscle recovery", "Skin protection", "Cooling"],
      measurement: "500ml",
    },
    {
      id: 22,
      name: "Lavender Lemonade",
      price: 110,
      image: "/images/lavender_lemonade.png",
      tag: "Calm",
      description:
        "Floral and functional. We infuse fresh lavender into alkaline lemonade for a drink that soothes the mind as much as it refreshes the body.",
      ingredients: ["Lavender Tea", "Lemon", "Agave", "Blue Pea Flower"],
      benefits: ["Stress relief", "Sleep aid", "Hydration", "Mood balance"],
      measurement: "500ml",
    },
    {
      id: 23,
      name: "Almond Mylk",
      price: 140,
      image: "/images/almond_mylk.png",
      tag: "Protein",
      description:
        "Creamy, rich, and 100% plant-based. Sprouted almonds blended with dates and vanilla. A perfect protein-rich snack or coffee creamer.",
      ingredients: [
        "Sprouted Almonds",
        "Filtered Water",
        "Dates",
        "Vanilla Bean",
        "Himalayan Salt",
      ],
      benefits: ["Plant protein", "Heart health", "Bone health", "Satiety"],
      measurement: "500ml",
    },
    {
      id: 24,
      name: "Golden Mango Delight",
      price: 130,
      image: "/images/golden_mango_delight.png",
      tag: "Vibrant",
      description:
        "A pure, sun-drenched celebration of the Alphonso mango. Rich, velvety, and naturally sweet, this juice captures the essence of an Indian summer in every sip.",
      ingredients: ["Alphonso Mango", "Dash of Lemon", "Coconut Water"],
      benefits: ["Vitamin A rich", "Immune support", "Digestion", "Pure energy"],
      measurement: "500ml",
    },
    {
      id: 25,
      name: "Spicy Mango Tang",
      price: 130,
      image: "/images/spicy_mango_tang.png",
      tag: "Zest",
      description:
        "Sweet meets heat. Succulent mango juice spiked with a hint of red chili and a squeeze of lime. An electrifying flavor combination that wakes up your palate.",
      ingredients: ["Mango", "Red Chili", "Lime", "Himalayan Salt"],
      benefits: ["Metabolism boost", "Vitamin C", "Electrolytes", "Mood lifter"],
      measurement: "500ml",
    },
  ],
  vegetables: [
    {
      id: 40,
      name: "Organic Spinach",
      price: 50,
      image:
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2940&auto=format&fit=crop",
      tag: "Leafy",
      description:
        "Tender, nutrient-dense spinach leaves. Perfect for salads or sautéing. Pre-washed and ready to eat.",
      ingredients: ["Organic Spinach"],
      benefits: ["Iron rich", "Vitamin K", "Magnesium", "Eye health"],
      measurement: "300g Bag",
    },
    {
      id: 41,
      name: "Curly Kale",
      price: 40,
      image:
        "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?q=80&w=2896&auto=format&fit=crop",
      tag: "Superfood",
      description:
        "Robust and earthy kale. Great for chips, smoothies, or salads. Packed with antioxidants.",
      ingredients: ["Organic Kale"],
      benefits: ["Vitamin C", "Vitamin A", "Calcium", "Detox"],
      measurement: "1 Bunch",
    },
    {
      id: 42,
      name: "Orange Carrots",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2787&auto=format&fit=crop",
      tag: "Crunchy",
      description: "Sweet, vibrant carrots harvested at peak ripeness. Excellent raw or roasted.",
      ingredients: ["Organic Carrots"],
      benefits: ["Beta-carotene", "Eye health", "Fiber", "Skin glow"],
      measurement: "1kg Bunch",
    },
    {
      id: 43,
      name: "Broccoli Florets",
      price: 50,
      image:
        "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=2802&auto=format&fit=crop",
      tag: "Fresh",
      description:
        "Clean, verified organic broccoli florets. Cruiferous goodness ready for steaming or roasting.",
      ingredients: ["Organic Broccoli"],
      benefits: ["Cancer fighting", "Fiber", "Vitamin C", "Bone health"],
      measurement: "400g Pack",
    },
    {
      id: 44,
      name: "Red Bell Peppers",
      price: 20,
      image: "/images/red_bell_peppers.png",
      tag: "Sweet",
      description:
        "Crisp and sweet red bell peppers. High in Vitamin C and perfect for stuffing or snacking.",
      ingredients: ["Organic Red Pepper"],
      benefits: ["Immunity", "Antioxidants", "Eye health", "Low calorie"],
      measurement: "Each",
    },
    {
      id: 45,
      name: "Sweet Potatoes",
      price: 30,
      image: "/images/sweet_potatoes.png",
      tag: "Root",
      description: "Naturally sweet and creamy tubers. Rich in fiber and complex carbohydrates.",
      ingredients: ["Organic Sweet Potato"],
      benefits: ["Gut health", "Brain function", "Immunity", "Vitamin A"],
      measurement: "1kg",
    },
    {
      id: 46,
      name: "Cherry Tomatoes",
      price: 40,
      image:
        "https://images.unsplash.com/photo-1561136594-7f68413baa99?q=80&w=2940&auto=format&fit=crop",
      tag: "Bite-size",
      description: "Bursting with flavor. These sweet cherry tomatoes are like nature's candy.",
      ingredients: ["Organic Cherry Tomatoes"],
      benefits: ["Lycopene", "Heart health", "Skin health", "Vitamin C"],
      measurement: "250g Box",
    },
    {
      id: 47,
      name: "Red Onions",
      price: 20,
      image:
        "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=2874&auto=format&fit=crop",
      tag: "Sharp",
      description:
        "Pungent and colorful. Essential for salads, pickling, or adding depth to cooked dishes.",
      ingredients: ["Organic Red Onion"],
      benefits: ["Antioxidants", "Antibacterial", "Bone density", "Digestion"],
      measurement: "1kg Bag",
    },
  ],
  fruits: [
    {
      id: 50,
      name: "Honeycrisp Apples",
      price: 40,
      image:
        "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=2940&auto=format&fit=crop",
      tag: "Crisp",
      description: "Explosively crisp and sweet-tart. The perfect snacking apple.",
      ingredients: ["Organic Honeycrisp Apple"],
      benefits: ["Fiber", "Heart health", "Weight aid", "Hydration"],
      measurement: "1kg",
    },
    {
      id: 51,
      name: "Organic Bananas",
      price: 20,
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=2960&auto=format&fit=crop",
      tag: "Energy",
      description: "Creamy and sweet. Provides instant energy and potassium.",
      ingredients: ["Organic Bananas"],
      benefits: ["Potassium", "Digestion", "Energy", "Heart health"],
      measurement: "1 Bunch (5-6)",
    },
    {
      id: 52,
      name: "Navel Oranges",
      price: 50,
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=2787&auto=format&fit=crop",
      tag: "Citrus",
      description: "Seedless, easy-peel oranges bursting with juice and Vitamin C.",
      ingredients: ["Organic Oranges"],
      benefits: ["Vitamin C", "Immunity", "Skin health", "Fiber"],
      measurement: "1kg Bag",
    },
    {
      id: 53,
      name: "Strawberries",
      price: 60,
      image: "/images/strawberries.png",
      tag: "Berry",
      description: "Sweet, ruby-red strawberries. Perfect for desserts or fresh eating.",
      ingredients: ["Organic Strawberries"],
      benefits: ["Antioxidants", "Heart health", "Blood sugar reg", "Vitamin C"],
      measurement: "250g Box",
    },
    {
      id: 54,
      name: "Blueberries",
      price: 70,
      image: "/images/blueberries.png",
      tag: "Superfood",
      description: "Plump and juicy blueberries. A top source of antioxidants.",
      ingredients: ["Organic Blueberries"],
      benefits: ["Brain health", "Anti-aging", "Heart health", "DNA repair"],
      measurement: "125g Box",
    },
    {
      id: 55,
      name: "Red Seedless Grapes",
      price: 60,
      image: "/images/red_grapes.png",
      tag: "Sweet",
      description: "Firm and sweet grapes without the seeds. A classic healthy snack.",
      ingredients: ["Organic Red Grapes"],
      benefits: ["Resveratrol", "Heart health", "Hydration", "Skin health"],
      measurement: "500g Box",
    },
    {
      id: 56,
      name: "Avocados",
      price: 30,
      image: "/images/avocados.png",
      tag: "Creamy",
      description: "Ripe, buttery Hass avocados. Essential for toast and salads.",
      ingredients: ["Organic Avocado"],
      benefits: ["Healthy fats", "Fiber", "Potassium", "Cholesterol"],
      measurement: "Each",
    },
    {
      id: 57,
      name: "Guavas",
      price: 20,
      image: "/images/guavas.png",
      tag: "Tropical",
      description:
        "Sweet and fragrant tropical guavas with a vibrant pink center. Rich in dietary fiber and exceptionally high in Vitamin C.",
      ingredients: ["Organic Guava"],
      benefits: ["Immunity boost", "Vitamin C", "Digestion", "Skin health"],
      measurement: "Each",
    },
  ],
};
