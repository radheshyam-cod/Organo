import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  UserContext,
  RecommendationSignal,
  JuiceRecommendation,
} from "../ai/recommendationEngine";
import {
  Zap,
  Clock,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  RotateCcw,
  ShoppingCart,
  Sparkles,
  Check,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { generateRecommendation, generateWeeklyRecommendations } from "../ai/recommendationEngine";
import { useCart } from "../features/cart/CartContext";
import { useProducts, type Product } from "../hooks/useProducts";
import { formatCurrency, getImageUrl } from "../lib/utils";

export default function RealTimeRecommender() {
  const { addToCart } = useCart();
  const { products } = useProducts();

  // Form state
  const [context, setContext] = useState<UserContext>({
    timeOfDay: "morning",
    energyLevel: "medium",
    weatherCondition: "mild",
    currentGoal: "recovery",
  });

  const [showWeekly, setShowWeekly] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Computed recommendations
  const currentRecommendation = useMemo(() => generateRecommendation(context), [context]);

  const weeklyRecommendations = useMemo(
    () => (showWeekly ? generateWeeklyRecommendations(context) : []),
    [context, showWeekly]
  );

  const handleSignalToggle = async (
    key: keyof UserContext,
    value: string | boolean | undefined
  ) => {
    setIsGenerating(true);
    // Simulate processing time for better UX
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    setContext((prev: UserContext) => {
      const updated = { ...prev };
      if (updated[key] === value) {
        delete updated[key];
      } else {
        (updated[key] as unknown) = value;
      }
      return updated;
    });

    setIsGenerating(false);
  };

  const handleReset = () => {
    setContext({
      timeOfDay: "morning",
      energyLevel: "medium",
      weatherCondition: "mild",
    });
  };

  const getTimeIcon = (time?: string) => {
    switch (time) {
      case "early-morning":
        return "🌅";
      case "morning":
        return "☀️";
      case "midday":
        return "🌞";
      case "afternoon":
        return "🌤️";
      case "evening":
        return "🌅";
      case "night":
        return "🌙";
      default:
        return "⏰";
    }
  };

  const getWeatherIcon = (weather?: string) => {
    switch (weather) {
      case "hot":
        return "🔥";
      case "cold":
        return "❄️";
      case "humid":
        return "💧";
      case "mild":
        return "🌤️";
      default:
        return "☁️";
    }
  };

  const juice = currentRecommendation
    ? products.find((j: Product) => j.id.toString() === currentRecommendation.juiceId.toString())
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-organo-cream via-white to-organo-pistachio/10 pt-24 pb-12 relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-organo-pistachio/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-organo-green/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 mb-8 relative z-10"
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-organo-green/10 text-organo-green px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            AI-Powered Recommendations
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-serif">
            Real-Time Juice Recommender
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get personalized juice recommendations based on your current state and goals
          </p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Signal Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-4 sm:p-6 sticky top-24 lg:top-32">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-organo-green" />
                Your Context
              </h2>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <div
                  className={`w-2 h-2 rounded-full ${Object.keys(context).length > 3 ? "bg-green-500" : "bg-amber-500"} animate-pulse`}
                />
                <span className="hidden sm:inline">
                  {Object.keys(context).length} signals active
                </span>
                <span className="sm:hidden">{Object.keys(context).length}</span>
              </div>
            </div>

            {/* Time of Day */}
            <div className="mb-4 sm:mb-6">
              <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="text-lg sm:text-base">🕐</span>{" "}
                <span className="hidden sm:inline">Time of Day</span>
                <span className="sm:hidden">Time</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {["early-morning", "morning", "midday", "afternoon", "evening", "night"].map(
                  (time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSignalToggle("timeOfDay", time)}
                      className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                        context.timeOfDay === time
                          ? "bg-gradient-to-r from-organo-green to-organo-green/90 text-white shadow-lg"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {context.timeOfDay === time && (
                        <Check className="absolute top-1 right-1 w-3 h-3 text-white/80" />
                      )}
                      <span className="text-base sm:text-lg mr-1">{getTimeIcon(time)}</span>
                      <span className="hidden xs:inline">
                        {time
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </span>
                      <span className="xs:hidden">
                        {time === "early-morning"
                          ? "Early"
                          : time === "morning"
                            ? "Morning"
                            : time === "midday"
                              ? "Midday"
                              : time === "afternoon"
                                ? "Afternoon"
                                : time === "evening"
                                  ? "Evening"
                                  : "Night"}
                      </span>
                    </motion.button>
                  )
                )}
              </div>
            </div>

            {/* Activity Signals */}
            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
              <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="text-lg sm:text-base">🏃</span> Activity
              </label>
              <div className="space-y-2">
                {[
                  { key: "workedOutToday", label: "💪 Worked Out Today", color: "green" },
                  { key: "skippedBreakfast", label: "🚫 Skipped Breakfast", color: "amber" },
                  { key: "recentlyIll", label: "🏥 Post-Illness Recovery", color: "blue" },
                ].map(({ key, label, color }) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSignalToggle(key as keyof UserContext, true)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all text-left relative ${
                      context[key as keyof UserContext]
                        ? `bg-${color}-50 text-${color}-700 border-2 border-${color}-200`
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {context[key as keyof UserContext] && (
                      <Check className="absolute top-2 right-2 w-4 h-4 text-green-600" />
                    )}
                    <span className="text-sm sm:text-base">{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Health Status */}
            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
              <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="text-lg sm:text-base">😴</span> Sleep Quality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["poor", "fair", "good", "excellent"].map((quality, idx) => (
                  <motion.button
                    key={quality}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSignalToggle("sleepQuality", quality)}
                    className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                      context.sleepQuality === quality
                        ? "bg-gradient-to-r from-organo-pistachio to-organo-green text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {context.sleepQuality === quality && (
                      <Check className="absolute top-1 right-1 w-3 h-3 text-white/80" />
                    )}
                    <span className="text-base sm:text-lg mr-1">
                      {idx === 0 ? "😫" : idx === 1 ? "😔" : idx === 2 ? "😊" : "😄"}
                    </span>
                    <span className="hidden xs:inline">
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </span>
                    <span className="xs:hidden">
                      {quality === "poor"
                        ? "Poor"
                        : quality === "fair"
                          ? "Fair"
                          : quality === "good"
                            ? "Good"
                            : "Excellent"}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
              <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="text-lg sm:text-base">😰</span> Stress Level
              </label>
              <div className="space-y-2">
                {[
                  { level: "low", emoji: "😌", color: "green" },
                  { level: "medium", emoji: "😐", color: "amber" },
                  { level: "high", emoji: "😰", color: "red" },
                ].map(({ level, emoji, color }) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSignalToggle("stressLevel", level)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all text-left relative ${
                      context.stressLevel === level
                        ? `bg-${color}-50 text-${color}-700 border-2 border-${color}-200`
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {context.stressLevel === level && (
                      <Check className="absolute top-2 right-2 w-4 h-4 text-green-600" />
                    )}
                    <span className="mr-2 text-base sm:text-base">{emoji}</span>
                    <span className="text-sm sm:text-base">
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
              <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="text-lg sm:text-base">🌤️</span> Weather
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["hot", "cold", "humid", "mild"].map((weather) => (
                  <motion.button
                    key={weather}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSignalToggle("weatherCondition", weather)}
                    className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                      context.weatherCondition === weather
                        ? "bg-gradient-to-r from-organo-green to-organo-green/90 text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {context.weatherCondition === weather && (
                      <Check className="absolute top-1 right-1 w-3 h-3 text-white/80" />
                    )}
                    <span className="text-base sm:text-lg mr-1">{getWeatherIcon(weather)}</span>
                    <span className="hidden xs:inline">
                      {weather.charAt(0).toUpperCase() + weather.slice(1)}
                    </span>
                    <span className="xs:hidden">
                      {weather === "hot"
                        ? "Hot"
                        : weather === "cold"
                          ? "Cold"
                          : weather === "humid"
                            ? "Humid"
                            : "Mild"}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="mb-4 sm:mb-6">
              <label className="text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="text-lg sm:text-base">🎯</span> Primary Goal
              </label>
              <div className="space-y-2">
                {[
                  { goal: "recovery", label: "💪 Recovery" },
                  { goal: "immunity", label: "🛡️ Immunity" },
                  { goal: "energy", label: "⚡ Energy" },
                  { goal: "fat-loss", label: "🎯 Fat Loss" },
                  { goal: "hydration", label: "💧 Hydration" },
                  { goal: "detox", label: "🧹 Detox" },
                ].map(({ goal, label }) => (
                  <motion.button
                    key={goal}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSignalToggle("currentGoal", goal)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all text-left relative ${
                      context.currentGoal === goal
                        ? "bg-gradient-to-r from-organo-pistachio to-organo-green text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {context.currentGoal === goal && (
                      <Check className="absolute top-2 right-2 w-4 h-4 text-white/80" />
                    )}
                    <span className="text-sm sm:text-base">{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="w-full mt-4 sm:mt-6 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 border border-gray-200"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Clear All Signals</span>
              <span className="sm:hidden">Clear All</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Recommendations Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-12 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-organo-green animate-spin" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">Analyzing your signals...</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Finding the perfect juice match for you
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : currentRecommendation && juice ? (
              <motion.div
                key={`rec-${currentRecommendation.juiceId}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-organo-green/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-organo-green/5 to-organo-pistachio/5 p-8 border-b border-organo-green/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-br from-organo-pistachio/20 to-organo-green/10 rounded-2xl flex items-center justify-center shadow-lg">
                            <img
                              src={getImageUrl(juice.image)}
                              alt={juice.name}
                              className="w-16 h-16 object-cover rounded-xl"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-organo-gold rounded-full flex items-center justify-center shadow-lg">
                            <Sparkles size={12} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-800 mb-1">{juice.name}</h3>
                          <p className="text-sm text-organo-green font-semibold bg-organo-green/10 px-3 py-1 rounded-full inline-block">
                            {juice.tag}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <div className="text-4xl font-bold text-organo-green">
                          {currentRecommendation.confidenceScore}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Match Score</p>
                        {currentRecommendation.confidenceScore >= 85 && (
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-organo-gold to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                              <span className="text-white text-xs font-bold">⭐</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {/* Trigger */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-5 bg-gradient-to-r from-organo-green/8 to-organo-pistachio/8 rounded-2xl border border-organo-green/20 hover:shadow-md transition-all"
                  >
                    <p className="text-sm text-gray-600 font-semibold flex items-center gap-2 mb-2">
                      <span className="text-lg">🎯</span> Trigger Detected
                    </p>
                    <p className="text-lg font-bold text-organo-green">
                      {currentRecommendation.trigger}
                    </p>
                  </motion.div>

                  {/* Why It Fits */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-5 bg-blue-50/80 rounded-2xl border border-blue-200/50 hover:shadow-md transition-all"
                  >
                    <p className="text-sm text-gray-600 font-semibold flex items-center gap-2 mb-3">
                      <Lightbulb size={18} className="text-blue-600" />
                      Why It Fits You
                    </p>
                    <p className="text-base text-gray-800 leading-relaxed">
                      {currentRecommendation.reason}
                    </p>
                  </motion.div>

                  {/* Best Time */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200/50 hover:shadow-md transition-all"
                  >
                    <p className="text-sm text-gray-600 font-semibold flex items-center gap-2 mb-3">
                      <Clock size={18} className="text-amber-600" />
                      Best Time to Enjoy
                    </p>
                    <p className="text-base text-gray-800 leading-relaxed">
                      {currentRecommendation.bestTime}
                    </p>
                  </motion.div>

                  {/* Expected Benefit */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-5 bg-green-50/80 rounded-2xl border border-green-200/50 hover:shadow-md transition-all"
                  >
                    <p className="text-sm text-gray-600 font-semibold flex items-center gap-2 mb-3">
                      <TrendingUp size={18} className="text-green-600" />
                      Expected Benefit
                    </p>
                    <p className="text-base text-gray-800 leading-relaxed">
                      {currentRecommendation.expectedBenefit}
                    </p>
                  </motion.div>

                  {/* Signals Used */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pb-6 border-b border-gray-100"
                  >
                    <p className="text-sm text-gray-600 font-bold mb-4 flex items-center gap-2">
                      <span className="text-lg">📊</span> Signals Analyzed
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentRecommendation.signals.map(
                        (signal: RecommendationSignal, idx: number) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + idx * 0.1 }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                              signal.priority === "critical"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : signal.priority === "high"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : signal.priority === "medium"
                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                    : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {signal.name}
                          </motion.span>
                        )
                      )}
                    </div>
                  </motion.div>

                  {/* Alternative */}
                  {currentRecommendation.alternative && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="p-5 bg-purple-50/80 rounded-2xl border border-purple-200/50 hover:shadow-md transition-all"
                    >
                      <p className="text-sm text-gray-600 font-bold flex items-center gap-2 mb-3">
                        <span className="text-lg">💜</span> Alternative Option
                      </p>
                      <p className="font-bold text-gray-800 text-lg">
                        {currentRecommendation.alternative.juiceName}
                      </p>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        {currentRecommendation.alternative.reason}
                      </p>
                    </motion.div>
                  )}

                  {/* Warnings */}
                  {currentRecommendation.warnings && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="p-5 bg-orange-50/80 rounded-2xl border border-orange-200/50 hover:shadow-md transition-all"
                    >
                      <p className="text-sm text-gray-600 font-bold flex items-center gap-2 mb-3">
                        <AlertCircle size={18} className="text-orange-600" />
                        Important Note
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {currentRecommendation.warnings}
                      </p>
                    </motion.div>
                  )}

                  {/* Pricing & Action */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center gap-4 pt-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium">Price</p>
                        <p className="text-3xl font-bold text-organo-green">
                          {formatCurrency(Number(juice.price))}
                        </p>
                      </div>
                      <div className="w-px h-12 bg-gray-200" />
                      <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium">Size</p>
                        <p className="text-lg font-bold text-gray-800">{juice.measurement}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        addToCart(juice.id.toString());
                      }}
                      className="flex-1 bg-gradient-to-r from-organo-green to-organo-green/90 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 shadow-lg"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center"
              >
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🌿</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Ready for Your Recommendation?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Select signals from the context panel to get personalized juice recommendations
                    tailored to your current state and goals.
                  </p>
                  <div className="mt-6 p-4 bg-organo-green/5 rounded-2xl border border-organo-green/20">
                    <p className="text-sm text-organo-green font-medium">
                      💡 <strong>Pro tip:</strong> The more signals you select, the more accurate
                      your recommendation will be!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weekly Recommendations Toggle */}
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowWeekly(!showWeekly)}
            className="w-full px-6 py-4 bg-gradient-to-r from-organo-pistachio/10 to-organo-green/5 border-2 border-organo-pistachio text-organo-green font-bold rounded-2xl hover:from-organo-pistachio/20 hover:to-organo-green/10 transition-all shadow-md"
          >
            <span className="flex items-center justify-center gap-2">
              {showWeekly ? "📅 Hide Weekly Plan" : "📅 View Weekly Recommendations"}
              <motion.div animate={{ rotate: showWeekly ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={16} />
              </motion.div>
            </span>
          </motion.button>

          {/* Weekly Grid */}
          <AnimatePresence>
            {showWeekly && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {weeklyRecommendations.map((rec: JuiceRecommendation, idx: number) => {
                  const weekJuice = products.find(
                    (j: Product) => j.id.toString() === rec.juiceId.toString()
                  );
                  const daysOfWeek = [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ];
                  return (
                    <motion.div
                      key={`weekly-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{
                        y: -2,
                        boxShadow:
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <img
                            src={weekJuice?.image ? getImageUrl(weekJuice.image) : ""}
                            alt={weekJuice?.name || ""}
                            className="w-10 h-10 object-cover rounded-lg shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-organo-gold rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{idx + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                            {daysOfWeek[idx % 7]}
                          </p>
                          <p className="font-bold text-gray-800 text-lg">{rec.juiceName}</p>
                          <p className="text-xs text-organo-green font-semibold bg-organo-green/10 px-2 py-1 rounded-full inline-block mt-1">
                            {rec.trigger}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-organo-green">
                            {rec.confidenceScore}%
                          </div>
                          <p className="text-xs text-gray-500">match</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{rec.reason}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Enhanced Tips Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-6xl mx-auto px-6 mt-16 relative z-10"
      >
        <div className="bg-gradient-to-r from-organo-cream via-white to-organo-pistachio/10 rounded-3xl p-8 border border-organo-pistachio/30 shadow-lg">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-organo-green/10 text-organo-green px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
              <Sparkles size={14} />
              Pro Tips
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Get the Most Accurate Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-left">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-bold text-gray-800 mb-2">Be Specific</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The more signals you activate, the more personalized and accurate your
                  recommendation becomes.
                </p>
              </div>
              <div className="text-left">
                <div className="text-2xl mb-2">⏰</div>
                <h4 className="font-bold text-gray-800 mb-2">Time Matters</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your body's needs change throughout the day. Update your context for time-specific
                  recommendations.
                </p>
              </div>
              <div className="text-left">
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-bold text-gray-800 mb-2">Stay Current</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Update your signals as your state changes to get the most relevant juice
                  suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
