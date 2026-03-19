import { useState, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Zap,
  Heart,
  Shield,
  Dumbbell,
  Sun,
  Moon,
  Coffee,
  ShoppingCart,
  Sparkles,
  X,
  Lightbulb,
  Droplet,
  Clock,
  ArrowRight,
  Check,
  Brain,
} from "lucide-react";
import { getSmartBanner, getTimeOfDay, type Goal } from "../ai/juiceAdvisor";
import { getHealthAdvicePack, type DailyAdvicePack } from "../ai/adviceEngine";
import { useCart } from "../features/cart/CartContext";
import { aiService } from "../services/aiService";
import { useAuth } from "../features/auth/AuthContext";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency } from "../lib/utils";

const GOALS: {
  id: Goal;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
}[] = [
  {
    id: "fat-loss",
    label: "Fat Loss",
    subtitle: "Burn, detox & lean out",
    description: "Accelerate metabolism and burn fat naturally with targeted juice combinations",
    icon: <Zap size={32} />,
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "recovery",
    label: "Recovery",
    subtitle: "Rebuild & replenish",
    description: "Repair muscles and restore energy with nutrient-dense recovery blends",
    icon: <Heart size={32} />,
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "immunity",
    label: "Immunity",
    subtitle: "Shield & strengthen",
    description: "Boost your immune system with vitamin-rich superfood combinations",
    icon: <Shield size={32} />,
    gradient: "from-emerald-500 to-teal-600",
  },
];

const TIME_ICONS: Record<string, React.ReactNode> = {
  morning: <Coffee size={16} />,
  afternoon: <Sun size={16} />,
  evening: <Moon size={16} />,
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export const AIAdvisor = () => {
  const [step, setStep] = useState<"goal" | "context" | "plan">("goal");
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [workedOut, setWorkedOut] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [advicePack, setAdvicePack] = useState<DailyAdvicePack | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredGoal, setHoveredGoal] = useState<Goal | null>(null);
  const { addToCart } = useCart();
  const { token } = useAuth();
  const { products } = useProducts();
  const [apiError, setApiError] = useState<string | null>(null);
  const controls = useAnimation();

  const timeOfDay = getTimeOfDay();

  const handleGoalSelect = useCallback(
    (goal: Goal) => {
      setSelectedGoal(goal);
      controls.start({ opacity: 0, y: 20 }).then(() => {
        setStep("context");
        controls.start({ opacity: 1, y: 0 });
      });
    },
    [controls]
  );

  const handleGeneratePlan = useCallback(async () => {
    if (!selectedGoal) return;
    if (!token) {
      setApiError("Please log in to generate your plan.");
      return;
    }
    setIsGenerating(true);
    setApiError(null);
    try {
      const res = await aiService.advisor(token, {
        goal:
          selectedGoal === "fat-loss"
            ? "energy"
            : selectedGoal === "immunity"
              ? "detox"
              : "recovery",
        timeOfDay,
        preferences: workedOut ? ["high protein"] : [],
      });
      setRecommendation(res.recommendation);
      const advice = getHealthAdvicePack(selectedGoal, timeOfDay, workedOut);
      setAdvicePack(advice);
      setStep("plan");
      setShowBanner(true);
    } catch (err: any) {
      setApiError(err.message ?? "Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedGoal, workedOut, token, timeOfDay]);

  const banner = selectedGoal ? getSmartBanner(workedOut, selectedGoal) : null;

  const planSlots = recommendation?.schedule
    ? (["morning", "afternoon", "evening"] as const).map((key) => {
        const slot = recommendation.schedule[key];
        const product = slot
          ? products.find(
              (p) => p.id.toString() === (slot.productId ?? slot.product?.id)?.toString()
            )
          : undefined;
        return {
          key,
          timeLabel: key.charAt(0).toUpperCase() + key.slice(1),
          icon:
            key === "morning" ? (
              <Coffee size={14} />
            ) : key === "afternoon" ? (
              <Sun size={14} />
            ) : (
              <Moon size={14} />
            ),
          data: {
            product,
            name: product?.name ?? slot?.name ?? "Juice",
            tag: product?.tag ?? recommendation.goal,
            price: product?.price ?? 0,
            reason:
              slot?.reason ??
              recommendation.reasoning?.goalAlignment?.join(", ") ??
              "Optimized for your goal",
            timing: key,
          },
        };
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-organo-cream via-white to-organo-pistachio/5 pt-24 pb-16 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-organo-pistachio/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-organo-green/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-organo-gold/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-organo-pistachio/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-organo-green/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-organo-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 left-10 w-72 h-72 bg-organo-pistachio/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-organo-green/10 rounded-full blur-3xl"
      />
      {/* Page Header */}
      <div className="relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 mb-12"
        >
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-organo-green/10 to-organo-pistachio/10 text-organo-green px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest mb-6 shadow-lg">
              <Sparkles size={16} className="animate-spin" style={{ animationDuration: "3s" }} />
              AI Wellness Advisor
              <Brain className="w-4 h-4" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-organo-green mb-4">
              Personalized Wellness Journey
            </h1>
            <p className="text-organo-gray text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Get your AI-powered daily juice plan tailored to your goals, lifestyle, and current
              state
            </p>
          </div>
        </motion.div>

        {/* Enhanced Progress Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-3 mb-12"
        >
          {(["goal", "context", "plan"] as const).map((s, i) => {
            const isActive = step === s;
            const isCompleted = i < (["goal", "context", "plan"] as const).indexOf(step);

            return (
              <motion.div
                key={s}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all relative ${
                  isActive
                    ? "bg-gradient-to-r from-organo-green to-organo-pistachio text-white shadow-lg scale-105"
                    : isCompleted
                      ? "bg-organo-pistachio text-organo-green shadow-md"
                      : "bg-white/50 text-gray-400 border border-gray-200 backdrop-blur-sm"
                }`}
              >
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isActive
                      ? "bg-white text-organo-green"
                      : isCompleted
                        ? "bg-organo-green text-white"
                        : "bg-gray-300 text-white"
                  }`}
                >
                  {isCompleted ? <Check size={12} /> : i + 1}
                </motion.div>
                <span>
                  {s === "goal" ? "Your Goal" : s === "context" ? "Daily Context" : "Your Plan"}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-organo-green/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {apiError && (
          <div className="max-w-3xl mx-auto mb-6 text-center text-red-600 text-sm font-semibold">
            {apiError}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Enhanced Goal Selection */}
          {step === "goal" && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="max-w-5xl mx-auto"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl text-organo-green text-center mb-4"
              >
                What's your primary health goal?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-organo-gray mb-12 max-w-2xl mx-auto"
              >
                Choose your wellness objective and we'll create a personalized juice plan tailored
                to your specific needs
              </motion.p>

              <div className="grid md:grid-cols-3 gap-8">
                {GOALS.map((goal, idx) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    onHoverStart={() => setHoveredGoal(goal.id)}
                    onHoverEnd={() => setHoveredGoal(null)}
                    className="relative"
                  >
                    <motion.button
                      whileHover={{ scale: 1.03, y: -8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGoalSelect(goal.id)}
                      className={`w-full bg-gradient-to-br ${goal.gradient} text-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 text-center relative overflow-hidden border border-white/20`}
                    >
                      {/* Animated background pattern */}
                      <motion.div
                        className="absolute inset-0 opacity-10"
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 20% 80%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)",
                          backgroundSize: "200% 200%",
                        }}
                      />

                      {/* Hover glow effect */}
                      {hoveredGoal === goal.id && (
                        <motion.div
                          layoutId="glow"
                          className="absolute inset-0 bg-white/20 rounded-3xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}

                      <motion.div
                        animate={{
                          rotate: hoveredGoal === goal.id ? [0, 5, -5, 0] : 0,
                        }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
                      >
                        {goal.icon}
                      </motion.div>

                      <div className="relative z-10">
                        <motion.div
                          className="font-bold text-2xl mb-2"
                          animate={{
                            scale: hoveredGoal === goal.id ? 1.1 : 1,
                          }}
                        >
                          {goal.label}
                        </motion.div>
                        <div className="text-white/80 text-sm mb-3">{goal.subtitle}</div>
                        <div className="text-white/60 text-xs leading-relaxed max-w-xs">
                          {goal.description}
                        </div>
                      </div>

                      <motion.div
                        animate={{
                          x: hoveredGoal === goal.id ? 5 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10"
                      >
                        <ArrowRight size={24} className="opacity-80" />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Daily Context */}
          {step === "context" && (
            <motion.div
              key="context"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="max-w-lg mx-auto"
            >
              <h2 className="font-serif text-2xl text-organo-green text-center mb-8">
                Tell us about your day
              </h2>

              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
                {/* Auto-detected time */}
                <div className="flex items-center gap-4 p-4 bg-organo-cream rounded-xl">
                  <div className="w-10 h-10 bg-organo-pistachio/30 rounded-full flex items-center justify-center text-organo-green">
                    {TIME_ICONS[timeOfDay]}
                  </div>
                  <div>
                    <div className="font-bold text-organo-green">{TIME_LABELS[timeOfDay]}</div>
                    <div className="text-sm text-gray-500">
                      Auto-detected based on your current time
                    </div>
                  </div>
                  <div className="ml-auto bg-organo-green text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                    Detected
                  </div>
                </div>

                {/* Workout toggle */}
                <div>
                  <label className="block text-sm font-bold text-organo-green uppercase tracking-wider mb-4">
                    Did you work out today?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setWorkedOut(true)}
                      className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${
                        workedOut
                          ? "border-organo-green bg-organo-green text-white shadow-lg"
                          : "border-gray-200 text-gray-500 hover:border-organo-green/50"
                      }`}
                    >
                      <Dumbbell size={20} />
                      Yes, I did!
                    </button>
                    <button
                      onClick={() => setWorkedOut(false)}
                      className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${
                        !workedOut
                          ? "border-organo-green bg-organo-green text-white shadow-lg"
                          : "border-gray-200 text-gray-500 hover:border-organo-green/50"
                      }`}
                    >
                      <span>😴</span>
                      Rest day
                    </button>
                  </div>
                </div>

                {/* Selected goal summary */}
                <div className="flex items-center gap-3 text-sm text-gray-600 border-t border-gray-100 pt-6">
                  <span>Goal:</span>
                  <span className="font-bold text-organo-green capitalize">
                    {selectedGoal?.replace("-", " ")}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-organo-green to-organo-pistachio text-white font-bold uppercase tracking-wider py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>AI is Crafting Your Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="animate-pulse" />
                      <span>Generate My Plan</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

                <button
                  onClick={() => setStep("goal")}
                  className="w-full text-center text-sm text-gray-400 hover:text-organo-green transition-colors"
                >
                  ← Change goal
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Plan */}
          {step === "plan" && recommendation && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="max-w-4xl mx-auto"
            >
              {/* Enhanced Smart Banner */}
              <AnimatePresence>
                {showBanner && banner && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="max-w-4xl mx-auto px-4 sm:px-6 mb-8"
                  >
                    <div className="bg-gradient-to-r from-organo-green/90 to-organo-pistachio/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-organo-green/20">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl">
                            <Lightbulb className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-lg">{banner.title}</p>
                            <p className="text-white/90 text-sm">{banner.message}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowBanner(false)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <X size={20} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <h2 className="font-serif text-2xl text-organo-green text-center mb-3">
                Your Personalized Plan for Today
              </h2>
              <p className="text-center text-gray-500 mb-10 text-sm">
                Based on your{" "}
                <strong className="text-organo-green capitalize">
                  {selectedGoal?.replace("-", " ")}
                </strong>{" "}
                goal
                {workedOut ? " + workout today" : ""}
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {planSlots.map(({ key, data, timeLabel, icon }, idx) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                  >
                    {/* Time badge */}
                    <div className="bg-organo-green px-4 py-2 flex items-center gap-2">
                      <div className="text-organo-pistachio">{icon}</div>
                      <span className="text-white text-xs font-bold uppercase tracking-widest">
                        {timeLabel}
                      </span>
                    </div>

                    {/* Juice image */}
                    <div className="h-44 overflow-hidden bg-organo-cream relative">
                      <img
                        src={data.product?.image || "/images/placeholder.png"}
                        alt={data.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-organo-green/90 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                        {data.tag}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-serif text-lg text-organo-green mb-1">{data.name}</h3>
                      <p className="text-xs text-organo-pistachio font-bold mb-3 uppercase tracking-wider">
                        {formatCurrency(Number(data.price))}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">{data.reason}</p>
                      <p className="text-xs text-gray-400 italic mb-4">{data.timing}</p>

                      {/* Key benefits */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(data.product?.benefits ?? []).slice(0, 2).map((b) => (
                          <span
                            key={b}
                            className="bg-organo-pistachio/20 text-organo-green text-xs px-2 py-0.5 rounded-full font-medium"
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      <button
                        disabled={!data.product}
                        onClick={() => data.product && addToCart(data.product.id.toString())}
                        className="w-full bg-organo-green text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg hover:bg-organo-green/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Health Advice Section */}
              {advicePack && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-12 space-y-8"
                >
                  {/* Main advice card */}
                  <div className="bg-gradient-to-br from-organo-green/10 to-emerald-50 rounded-2xl p-8 border-2 border-organo-green/20">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{advicePack.mainAdvice.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb size={16} className="text-organo-green" />
                          <h3 className="font-serif text-2xl text-organo-green">
                            {advicePack.mainAdvice.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {advicePack.mainAdvice.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          {advicePack.mainAdvice.tips.map((tip, idx) => (
                            <div key={idx} className="flex gap-3">
                              <span className="text-organo-pistachio font-bold text-lg">✓</span>
                              <span className="text-sm text-gray-700">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supporting advice cards */}
                  <div>
                    <h3 className="font-serif text-xl text-organo-green mb-4">
                      Additional Guidance
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {advicePack.tips.map((tip, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <span className="text-2xl">{tip.icon}</span>
                            <h4 className="font-bold text-organo-green">{tip.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                          <ul className="space-y-1">
                            {tip.tips.map((t, i) => (
                              <li key={i} className="text-xs text-gray-500 flex gap-2">
                                <span className="text-organo-pistachio">•</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Hydration & Timing Tips */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Hydration Tip */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-400"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Droplet size={20} className="text-blue-500" />
                        <h4 className="font-bold text-blue-900">Hydration Tip</h4>
                      </div>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {advicePack.hydrationTip}
                      </p>
                    </motion.div>

                    {/* Timing Tip */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-l-4 border-amber-400"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Clock size={20} className="text-amber-600" />
                        <h4 className="font-bold text-amber-900">Timing Tip</h4>
                      </div>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        {advicePack.timingTip}
                      </p>
                    </motion.div>
                  </div>

                  {/* Motivational Message */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="bg-gradient-to-r from-organo-green to-emerald-700 text-white rounded-xl p-6 text-center shadow-lg"
                  >
                    <p className="text-lg font-serif italic">{advicePack.motivationalMessage}</p>
                  </motion.div>
                </motion.div>
              )}

              {/* Reset */}
              <div className="text-center pt-8">
                <button
                  onClick={() => {
                    setStep("goal");
                    setSelectedGoal(null);
                    setRecommendation(null);
                    setAdvicePack(null);
                  }}
                  className="text-sm text-gray-400 hover:text-organo-green transition-colors underline underline-offset-4"
                >
                  Start over with a different goal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
