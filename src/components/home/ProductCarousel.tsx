import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useCart } from "../../features/cart/CartContext";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../ProductCard";

export const ProductCarousel = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category || "All")));
    return cats.length ? ["All", ...cats.filter((c) => c !== "All")] : ["All"];
  }, [products]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [showAll, setShowAll] = useState(false);

  const currentProducts = products.filter((p) => activeTab === "All" || p.category === activeTab);
  const displayedProducts = showAll ? currentProducts : currentProducts.slice(0, 4);

  return (
    <section className="py-20 bg-organo-cream" aria-labelledby="carousel-heading">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2
              id="carousel-heading"
              className="font-serif text-4xl md:text-5xl text-organo-green mb-4"
            >
              Fresh from the Field
            </h2>
            <p className="text-organo-gray max-w-lg">
              Harvested within the last 24 hours. Inventory updates daily at 5 AM.
            </p>
          </div>

          <div className="flex space-x-2 mt-6 md:mt-0 bg-white p-1 rounded-full shadow-sm border border-gray-100">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowAll(false);
                }}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all",
                  activeTab === tab
                    ? "bg-organo-green text-white shadow-md"
                    : "text-gray-400 hover:text-organo-green"
                )}
                aria-pressed={activeTab === tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} onAdd={addToCart} variant="carousel" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {currentProducts.length > 4 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-white border-2 border-organo-green text-organo-green hover:bg-organo-green hover:text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/shop" className="text-organo-green font-bold hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    </section>
  );
};
