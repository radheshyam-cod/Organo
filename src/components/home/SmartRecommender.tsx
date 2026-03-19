import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Heart,
  Shield,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { getQuickRecommendation } from "../../ai/juiceAdvisor";
import { useCart } from "../../features/cart/CartContext";
import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import { formatCurrency } from "../../lib/utils";

type Need = "energy" | "recover" | "cleanse";

const NEEDS: {
  id: Need;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  emoji: string;
  gradient: string;
}[] = [
  {
    id: "energy",
    label: "Energy",
    subtitle: "Fuel & focus",
    icon: <Zap size={24} />,
    emoji: "⚡",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: "recover",
    label: "Recover",
    subtitle: "Rebuild & replenish",
    icon: <Heart size={24} />,
    emoji: "💙",
    gradient: "from-rose-400 to-pink-500",
  },
  {
    id: "cleanse",
    label: "Cleanse",
    subtitle: "Detox & refresh",
    icon: <Shield size={24} />,
    emoji: "🌿",
    gradient: "from-emerald-500 to-teal-600",
  },
];

function getTimeContext(): { greeting: string; context: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: "Good morning", context: "Start your day with intention." };
  if (hour < 17)
    return { greeting: "Good afternoon", context: "Midday fuel for peak performance." };
  return { greeting: "Good evening", context: "Wind down and restore." };
}

export const SmartRecommender = () => {
  const [selected, setSelected] = useState<Need | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToCart } = useCart();
  const { greeting, context } = getTimeContext();

  const handleNeedSelect = async (need: Need) => {
    setIsGenerating(true);
    setSelected(need);

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    setRecommendations(getQuickRecommendation(need));
    setIsGenerating(false);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Enhanced decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-organo-pistachio/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-organo-green/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl animate-pulse" />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-organo-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-organo-green/10 to-organo-pistachio/10 text-organo-green px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6 shadow-lg">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: "3s" }} />
            Smart Recommendations
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-organo-green mb-3 sm:mb-4 bg-gradient-to-r from-organo-green to-organo-pistachio bg-clip-text text-transparent">
            {greeting}. 🌿
          </h2>
          <p className="text-organo-gray text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            {context} What does your body need right now?
          </p>
        </motion.div>

        {/* Enhanced Need selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16 flex-wrap px-2"
        >
          {NEEDS.map((need, index) => (
            <motion.button
              key={need.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNeedSelect(need.id)}
              disabled={isGenerating}
              className={`relative flex items-center gap-2 sm:gap-3 lg:gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 rounded-2xl sm:rounded-3xl font-bold shadow-xl transition-all border-2 overflow-hidden group min-w-[140px] sm:min-w-[160px] ${
                selected === need.id
                  ? `bg-gradient-to-r ${need.gradient} text-white border-transparent shadow-2xl transform scale-105`
                  : "bg-white text-organo-green border-organo-green/20 hover:border-organo-green/50 hover:shadow-2xl"
              } ${isGenerating ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {/* Background animation for selected state */}
              {selected === need.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <span className="text-lg sm:text-xl lg:text-2xl relative z-10">{need.emoji}</span>
              <div className="text-left relative z-10 flex-1">
                <div className="text-sm sm:text-base lg:text-lg">{need.label}</div>
                <div
                  className={`text-xs sm:text-sm font-normal transition-colors ${
                    selected === need.id ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  <span className="hidden sm:inline">{need.subtitle}</span>
                  <span className="sm:hidden">{need.subtitle.split(" ")[0]}</span>
                </div>
              </div>

              {/* Loading indicator */}
              {isGenerating && selected === need.id && (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin relative z-10" />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Results */}
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <div className="inline-flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-organo-green animate-spin" />
                <div>
                  <p className="text-xl font-bold text-gray-800">Finding perfect matches...</p>
                  <p className="text-gray-600 mt-1">
                    Analyzing your needs for the best recommendations
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {selected && recommendations.length > 0 && !isGenerating && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-organo-green/10 text-organo-green px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <Check size={16} />
                  Perfect matches found
                </div>
                <p className="text-center text-lg text-organo-gray font-medium">
                  For <strong className="text-organo-green capitalize">{selected}</strong> right
                  now:
                </p>
              </motion.div>

              <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8 flex-wrap px-2">
                {recommendations.map((juice, i) => (
                  <motion.div
                    key={juice.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-white to-organo-cream/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl w-full sm:w-80 group hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500 border border-organo-green/10"
                  >
                    <div className="h-48 sm:h-56 overflow-hidden relative">
                      <img
                        src={juice.image}
                        alt={juice.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                        <span className="bg-organo-green/90 backdrop-blur-sm text-white text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                          {juice.tag}
                        </span>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-organo-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="font-serif text-lg sm:text-xl text-organo-green mb-2 font-bold">
                        {juice.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                        {juice.description}
                      </p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-5">
                        {juice.benefits.slice(0, 3).map((b, idx) => (
                          <motion.span
                            key={b}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.15 + idx * 0.05 }}
                            className="bg-organo-pistachio/30 text-organo-green text-xs px-2 sm:px-3 py-1 rounded-full font-medium border border-organo-pistachio/50"
                          >
                            {b}
                          </motion.span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-organo-green text-lg sm:text-2xl">
                            {formatCurrency(Number(juice.price))}
                          </span>
                          <p className="text-xs text-gray-500">{juice.measurement}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(juice.id.toString())}
                          className="bg-gradient-to-r from-organo-green to-organo-green/90 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shadow-lg"
                        >
                          <ShoppingCart size={12} className="sm:hidden" />
                          <ShoppingCart size={14} className="hidden sm:block" />
                          <span className="hidden sm:inline">Add</span>
                          <span className="sm:hidden">+</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced CTA to full advisor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-12 sm:mt-16 px-4"
              >
                <div className="bg-gradient-to-r from-organo-cream to-organo-pistachio/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-organo-pistachio/30 shadow-lg max-w-2xl mx-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                    Want a personalized daily plan?
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    Get AI-powered recommendations tailored to your specific goals and lifestyle
                  </p>
                  <Link
                    to="/ai-advisor"
                    className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-organo-green to-organo-green/90 text-white font-bold uppercase tracking-wider px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group text-sm sm:text-base"
                  >
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                    <span className="hidden sm:inline">Get My Full Daily Plan</span>
                    <span className="sm:hidden">Full Plan</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <p className="text-xs text-gray-500 mt-3 sm:mt-4">
                    ⚡{" "}
                    <span className="hidden sm:inline">
                      Personalized for your goal · Takes 30 seconds
                    </span>
                    <span className="sm:hidden">Personalized · 30s</span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {!selected && !isGenerating && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 sm:py-16 px-4"
            >
              <div className="max-w-md mx-auto">
                <div
                  className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 animate-bounce"
                  style={{ animationDuration: "2s" }}
                >
                  ☝️
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  What do you need today?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Select what your body needs above to get personalized juice recommendations
                </p>
                <Link
                  to="/ai-advisor"
                  className="inline-flex items-center gap-2 text-organo-green font-bold text-base sm:text-lg hover:text-organo-green/80 transition-colors group"
                >
                  <span className="hidden sm:inline">Or get a full personalized plan</span>
                  <span className="sm:hidden">Full plan</span>
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
