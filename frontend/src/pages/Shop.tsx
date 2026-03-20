import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { useCart } from "../features/cart/CartContext";
import { cn } from "../lib/utils";

type Category = string;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export const Shop = () => {
  const { products, loading, error } = useProducts();
  const categories = useMemo<Category[]>(() => {
    const cats = Array.from(new Set(products.map((p) => p.category || "All")));
    return cats.length ? ["All", ...cats.filter((c) => c !== "All")] : ["All"];
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [direction, setDirection] = useState(0);
  const { addToCart } = useCart();

  const filteredProducts = useMemo(
    () => products.filter((p) => activeCategory === "All" || p.category === activeCategory),
    [products, activeCategory]
  );

  const changeCategory = (newCategory: Category) => {
    const currentIndex = categories.indexOf(activeCategory);
    const newIndex = categories.indexOf(newCategory);
    const newDirection = newIndex > currentIndex ? 1 : -1;

    setDirection(newDirection);
    setActiveCategory(newCategory);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-organo-cream overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl text-organo-green mb-4">Shop Juices</h1>
            <p className="text-organo-gray max-w-lg text-lg">
              Cold-pressed, organic, and delivered straight from our farm to your doorstep.
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-6 md:mt-0">
            <div className="bg-white p-1 rounded-full shadow-sm border border-gray-100 flex">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => changeCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all",
                    activeCategory === cat
                      ? "bg-organo-green text-white shadow-md relative z-10"
                      : "text-gray-400 hover:text-organo-green"
                  )}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
          <motion.div
            key={activeCategory}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
