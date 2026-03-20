import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Zap,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Sparkles,
  Loader2,
  Bot,
  Target,
  Activity,
  Brain,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { generateAssistantResponse, detectIntent, HELP_ARTICLES } from "../ai/operationsAssistant";

export default function WellnessOperationsCenter() {
  // State
  const [userQuestion, setUserQuestion] = useState("");
  const [userType, setUserType] = useState<"customer" | "operations" | "admin" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedHelp, setSelectedHelp] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  // Computed
  const assistantResponse =
    userQuestion && userType
      ? generateAssistantResponse({
          userMessage: userQuestion,
          intent: detectIntent({ userMessage: userQuestion }),
        })
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userQuestion.trim() && userType) {
      setIsAnalyzing(true);
      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowResult(true);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUserQuestion("");
    setUserType(null);
    setShowResult(false);
    setSelectedHelp(null);
  };

  // Tool cards data
  const tools = [
    {
      id: "plan",
      icon: Lightbulb,
      title: "Nutrition Assistant",
      subtitle: "Personalized Plans",
      description:
        "Create comprehensive wellness plans based on your health profile, goals, and dietary needs.",
      route: "/nutrition-assistant",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      use: "For customers building structured wellness routines",
      time: "Daily to weekly",
      value: "Higher retention & repeat purchases",
    },
    {
      id: "forecast",
      icon: BarChart3,
      title: "Demand Intelligence",
      subtitle: "Forecasting & Operations",
      description:
        "Optimize inventory, reduce waste, and improve sourcing with AI-powered demand forecasting.",
      route: "/demand-forecasting",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      use: "For operations teams reducing waste and optimizing supply",
      time: "Weekly to quarterly",
      value: "Reduced waste, improved margins",
    },
    {
      id: "recommend",
      icon: Zap,
      title: "Smart Recommender",
      subtitle: "Real-Time Suggestions",
      description:
        "Get instant personalized juice suggestions based on your current activity, stress, and goals.",
      route: "/recommender",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      use: "For immediate customer guidance and impulse purchases",
      time: "Instant (seconds)",
      value: "Increased conversions & AOV",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-organo-cream via-white to-organo-pistachio/10 pt-24 pb-12 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 relative z-10"
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-organo-green/10 to-organo-pistachio/10 text-organo-green px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest mb-6 shadow-lg">
            <Sparkles size={16} className="animate-spin" style={{ animationDuration: "3s" }} />
            Wellness Hub
            <Brain className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Compass className="w-12 h-12 text-organo-green" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 font-serif">
              Wellness Operations Center
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            AI-powered wellness ecosystem for personalized juice plans, demand forecasting, and
            real-time recommendations. Your intelligent wellness journey starts here.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Enhanced Quick Intent Detector */}
        {!showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-organo-green/20 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-organo-green to-organo-pistachio rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  How can I help you today?
                </h2>
              </div>

              {/* Enhanced User Type Selection */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-700 block mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-organo-green" />I am a:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    {
                      value: "customer",
                      label: "👤 Customer",
                      desc: "Personal wellness",
                      color: "green",
                    },
                    {
                      value: "operations",
                      label: "🏢 Operations",
                      desc: "Business needs",
                      color: "blue",
                    },
                    { value: "admin", label: "👨‍💼 Admin", desc: "Management", color: "purple" },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setUserType(option.value as "customer" | "operations" | "admin");
                        setShowResult(false);
                      }}
                      className={`px-4 py-4 sm:py-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                        userType === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                          : "border-gray-200 hover:border-organo-green/50 hover:bg-organo-cream/30"
                      }`}
                    >
                      {userType === option.value && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                      <p className="font-bold text-gray-800 text-base sm:text-lg mb-1">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Enhanced Question Input */}
              {userType && (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <label className="text-sm font-bold text-gray-700 block flex items-center gap-2">
                    <Activity className="w-4 h-4 text-organo-green" />
                    Tell me what you need:
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        placeholder="e.g., 'I want a personalized wellness plan' or 'Help me forecast demand' or 'What should I drink now?'"
                        className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:border-organo-green focus:outline-none transition-all text-sm sm:text-base"
                      />
                      {userQuestion && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <Sparkles className="w-5 h-5 text-organo-green animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                    <motion.button
                      type="submit"
                      disabled={!userQuestion.trim() || isAnalyzing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 sm:py-4 bg-gradient-to-r from-organo-green to-organo-green/90 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <ArrowRight size={20} />
                          Analyze
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        )}

        {/* Assistant Response */}
        <AnimatePresence>
          {showResult && assistantResponse && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div
                className={`rounded-2xl border-2 p-8 mb-6 ${
                  assistantResponse.function === "personalized-plan"
                    ? "bg-blue-50 border-blue-200"
                    : assistantResponse.function === "forecasting"
                      ? "bg-purple-50 border-purple-200"
                      : "bg-green-50 border-green-200"
                }`}
              >
                {/* Confidence Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {assistantResponse.confidence >= 80 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : assistantResponse.confidence >= 60 ? (
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    ) : (
                      <HelpCircle className="w-6 h-6 text-gray-600" />
                    )}
                    <span className="text-sm font-bold">
                      {assistantResponse.confidence}% confident in this recommendation
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Try again
                  </button>
                </div>

                {/* Title & Function */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {assistantResponse.function === "personalized-plan" &&
                    "📋 Personalized Plan Path"}
                  {assistantResponse.function === "forecasting" && "📊 Forecast & Operations Path"}
                  {assistantResponse.function === "smart-recommendation" &&
                    "⚡ Real-Time Recommendation Path"}
                  {assistantResponse.function === "unknown" && "🤔 Multiple Options"}
                </h3>

                {/* Reasoning */}
                <p className="text-gray-700 mb-4">{assistantResponse.reasoning}</p>

                {/* Recommendation Box */}
                <div className="bg-white rounded-lg p-4 mb-6 border-l-4 border-organo-green">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Recommended Approach:</p>
                  <p className="text-gray-800">{assistantResponse.recommendation}</p>
                </div>

                {/* Next Step CTA */}
                <Link
                  to={assistantResponse.nextStep.route}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition mb-6 ${
                    assistantResponse.function === "personalized-plan"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : assistantResponse.function === "forecasting"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {assistantResponse.nextStep.label}
                  <ArrowRight size={20} />
                </Link>

                {/* Related Tools */}
                {assistantResponse.relatedTools && assistantResponse.relatedTools.length > 0 && (
                  <div className="border-t border-gray-300 pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Related tools you might also find useful:
                    </p>
                    <div className="space-y-2">
                      {assistantResponse.relatedTools.map((tool, idx) => (
                        <Link
                          key={idx}
                          to={tool.route}
                          className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition"
                        >
                          <ArrowRight size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-800">{tool.name}</p>
                            <p className="text-sm text-gray-600">{tool.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Tool Cards Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              All Available Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our complete suite of AI-powered wellness and operations tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  className={`rounded-3xl border-2 ${tool.borderColor} ${tool.bgColor} p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${
                    hoveredTool === tool.id ? "transform scale-105" : ""
                  }`}
                >
                  {/* Hover Background Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredTool === tool.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${tool.color} mb-6 relative z-10`}
                  >
                    <motion.div
                      animate={{ rotate: hoveredTool === tool.id ? [0, 10, -10, 0] : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-3 relative z-10">
                    {tool.title}
                  </h3>
                  <p className="text-sm sm:text-base text-organo-green font-bold mb-4 relative z-10">
                    {tool.subtitle}
                  </p>

                  <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed relative z-10">
                    {tool.description}
                  </p>

                  {/* Enhanced Key Info */}
                  <div className="space-y-3 mb-6 text-sm relative z-10">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg bg-${tool.color.split("-")[1]}-100 flex items-center justify-center flex-shrink-0`}
                      >
                        <Target className={`w-4 h-4 text-${tool.color.split("-")[1]}-600`} />
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-1">
                          Use case
                        </p>
                        <p className="text-gray-700">{tool.use}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg bg-${tool.color.split("-")[1]}-100 flex items-center justify-center flex-shrink-0`}
                      >
                        <Clock className={`w-4 h-4 text-${tool.color.split("-")[1]}-600`} />
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-1">
                          Timeframe
                        </p>
                        <p className="text-gray-700">{tool.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg bg-${tool.color.split("-")[1]}-100 flex items-center justify-center flex-shrink-0`}
                      >
                        <TrendingUp className={`w-4 h-4 text-${tool.color.split("-")[1]}-600`} />
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-1">
                          Business value
                        </p>
                        <p className="text-gray-700">{tool.value}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={tool.route}
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-white transition-all bg-gradient-to-r ${tool.color} hover:shadow-lg hover:-translate-y-1 relative z-10`}
                  >
                    Launch Tool
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Help & Guidance Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Help & Guidance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about our wellness tools
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-gray-200 p-6 sm:p-8 shadow-xl">
            {/* Enhanced Help Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(HELP_ARTICLES).map(([key, article]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedHelp(selectedHelp === key ? null : key)}
                  className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                    selectedHelp === key
                      ? "border-organo-green bg-organo-cream/50 shadow-lg"
                      : "border-gray-200 hover:border-organo-green/50 hover:bg-organo-cream/30"
                  }`}
                >
                  <p className="font-bold text-gray-800 flex items-center gap-3 mb-2">
                    <div className="p-2 bg-organo-green/10 rounded-lg">
                      <HelpCircle size={18} className="text-organo-green" />
                    </div>
                    {key
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </p>
                  <AnimatePresence>
                    {selectedHelp === key && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-gray-700 leading-relaxed"
                      >
                        {article}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Features & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-organo-green/10 to-organo-pistachio/10 rounded-3xl border border-organo-green/20 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-organo-green rounded-2xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">For Customers</h3>
            </div>
            <ul className="space-y-4 text-sm sm:text-base text-gray-700">
              {[
                "Personalized wellness plans based on health profiles",
                "Real-time juice recommendations for your current state",
                "Safe, personalized guidance respecting allergies & restrictions",
                "Quick checkout with AI-recommended bundles",
              ].map((benefit, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-3xl border border-purple-200 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-600 rounded-2xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">For Operations</h3>
            </div>
            <ul className="space-y-4 text-sm sm:text-base text-gray-700">
              {[
                "Reduce waste by 20-30% with smart demand forecasting",
                "Optimize inventory levels and sourcing priorities",
                "Identify high-growth and slow-moving SKUs early",
                "Data-driven pricing and bundle recommendations",
              ].map((benefit, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Enhanced Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          {!showResult && (
            <div className="bg-gradient-to-r from-organo-green/10 to-organo-pistachio/10 rounded-3xl p-8 sm:p-12 border border-organo-green/20 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                  Ready to get started?
                </h3>
                <p className="text-gray-700 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
                  Answer a quick question above to get a personalized recommendation for which tool
                  best fits your needs.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="px-8 py-4 bg-gradient-to-r from-organo-green to-organo-green/90 text-white rounded-xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Started
                  <ArrowRight size={20} />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
