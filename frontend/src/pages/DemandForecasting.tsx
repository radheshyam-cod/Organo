import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DemandReport } from "../ai/demandPredictor";
import {
  TrendingUp,
  AlertTriangle,
  Truck,
  DollarSign,
  BarChart3,
  Zap,
  Heart,
  DropletIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  generateDemandReport,
  getInventoryOptimizations,
  getSmartJuiceCombos,
} from "../ai/demandPredictor";
import { formatCurrency } from "../lib/utils";

interface TabState {
  activeTab: "overview" | "forecast" | "waste" | "sourcing" | "pricing" | "inventory" | "combos";
}

type OptimizationItem = {
  item: string;
  current: string;
  recommended: string;
  rationale: string;
};

type BundleCombo = {
  title: string;
  juices: { id: number; name: string }[];
  bundlePrice: number;
  reason: string;
  targetGoal: string;
};

export default function DemandForecasting() {
  const [tabState, setTabState] = useState<TabState>({ activeTab: "overview" });
  const report: DemandReport = useMemo(() => generateDemandReport(), []);
  const optimizations = useMemo(() => getInventoryOptimizations(), []);
  const combos = useMemo(() => getSmartJuiceCombos(), []);

  const topGrowers = report.entries
    .filter((e) => e.weekOverWeekChange && e.weekOverWeekChange > 10)
    .sort((a, b) => (b.weekOverWeekChange || 0) - (a.weekOverWeekChange || 0));

  const slowMovers = report.entries.filter((e) => e.level === "low").slice(0, 5);

  const highDemand = report.entries.filter((e) => e.level === "high").length;
  const mediumDemand = report.entries.filter((e) => e.level === "medium").length;
  const lowDemand = report.entries.filter((e) => e.level === "low").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-organo-cream via-white to-organo-pistachio/20 pt-24 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-organo-green" />
          <h1 className="text-4xl font-bold text-gray-800">Demand Intelligence</h1>
        </div>
        <p className="text-gray-600">
          AI-powered forecasting for optimal inventory, sourcing, and production planning
        </p>
        <p className="text-sm text-gray-500 mt-1">Week of {report.weekLabel}</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white border-2 border-organo-green/20 rounded-2xl p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">High Demand</span>
            <TrendingUp className="w-5 h-5 text-organo-green" />
          </div>
          <p className="text-3xl font-bold text-organo-green">{highDemand}</p>
          <p className="text-xs text-gray-500 mt-1">Juices trending up</p>
        </div>

        <div className="bg-white border-2 border-organo-pistachio/20 rounded-2xl p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Medium Demand</span>
            <BarChart3 className="w-5 h-5 text-organo-pistachio" />
          </div>
          <p className="text-3xl font-bold text-organo-pistachio">{mediumDemand}</p>
          <p className="text-xs text-gray-500 mt-1">Stable performance</p>
        </div>

        <div className="bg-white border-2 border-organo-gold/20 rounded-2xl p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Low Demand</span>
            <AlertTriangle className="w-5 h-5 text-organo-gold" />
          </div>
          <p className="text-3xl font-bold text-organo-gold">{lowDemand}</p>
          <p className="text-xs text-gray-500 mt-1">Slow movers</p>
        </div>

        <div className="bg-white border-2 border-red-200/50 rounded-2xl p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Waste Risk</span>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-500">
            {report.wasteRisk.filter((w) => w.riskLevel === "critical").length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Critical items</p>
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="max-w-7xl mx-auto px-6 mb-8"
      >
        <div className="bg-gradient-to-r from-organo-cream to-organo-pistachio/10 rounded-2xl p-6 border border-organo-pistachio/30">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-organo-green" />
            Key Insights
          </h3>
          <div className="space-y-2">
            {report.insights.map((insight, idx) => (
              <p key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-organo-green mt-1">•</span>
                <span>{insight}</span>
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-6 mb-8"
      >
        <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 border border-gray-200">
          {[
            { id: "overview" as const, label: "📊 Overview" },
            { id: "forecast" as const, label: "📈 Forecast" },
            { id: "waste" as const, label: "⚠️  Waste Risk" },
            { id: "sourcing" as const, label: "🚚 Sourcing" },
            { id: "pricing" as const, label: "💰 Pricing" },
            { id: "inventory" as const, label: "📦 Inventory" },
            { id: "combos" as const, label: "🎁 Bundles" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabState({ activeTab: tab.id })}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                tabState.activeTab === tab.id
                  ? "bg-organo-green text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {tabState.activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Growers */}
                <div className="bg-white rounded-2xl border border-green-200/50 p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Growing (10%+ WoW)
                  </h3>
                  <div className="space-y-3">
                    {topGrowers.length > 0 ? (
                      topGrowers.map((juice, idx) => (
                        <motion.div
                          key={juice.juiceId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{juice.juiceName}</p>
                            <p className="text-xs text-gray-600">{juice.tag}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">+{juice.weekOverWeekChange}%</p>
                            <p className="text-xs text-gray-500">Score: {juice.demandScore}</p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No growing items this week</p>
                    )}
                  </div>
                </div>

                {/* Slow Movers */}
                <div className="bg-white rounded-2xl border border-amber-200/50 p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Slow Movers (Low Demand)
                  </h3>
                  <div className="space-y-3">
                    {slowMovers.map((juice, idx) => (
                      <motion.div
                        key={juice.juiceId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{juice.juiceName}</p>
                          <p className="text-xs text-gray-600">{juice.tag}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">{juice.weekOverWeekChange}%</p>
                          <p className="text-xs text-gray-500">Score: {juice.demandScore}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FORECAST TAB */}
          {tabState.activeTab === "forecast" && (
            <motion.div
              key="forecast"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Demand Forecast by SKU</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Juice</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tag</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Level</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Trend</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        WoW Change
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Inventory Days
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.entries.map((entry, idx) => (
                      <motion.tr
                        key={entry.juiceId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-4 font-medium text-gray-800">{entry.juiceName}</td>
                        <td className="py-4 px-4 text-gray-600">{entry.tag}</td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${
                              entry.demandScore >= 70
                                ? "bg-green-100 text-green-700"
                                : entry.demandScore >= 50
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {entry.demandScore}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`capitalize inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              entry.level === "high"
                                ? "bg-green-100 text-green-700"
                                : entry.level === "medium"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {entry.level}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`font-semibold ${
                              entry.trend === "up"
                                ? "text-green-600"
                                : entry.trend === "stable"
                                  ? "text-blue-600"
                                  : "text-red-600"
                            }`}
                          >
                            {entry.trend === "up" ? "📈" : entry.trend === "stable" ? "➡️" : "📉"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`font-semibold ${
                              (entry.weekOverWeekChange || 0) > 0
                                ? "text-green-600"
                                : (entry.weekOverWeekChange || 0) < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {(entry.weekOverWeekChange || 0) > 0 ? "+" : ""}
                            {entry.weekOverWeekChange}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-gray-700">
                          {entry.inventoryDays || "-"}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* WASTE RISK TAB */}
          {tabState.activeTab === "waste" && (
            <motion.div
              key="waste"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {report.wasteRisk.map((risk, idx) => (
                  <motion.div
                    key={risk.juiceId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-2xl p-6 border-l-4 ${
                      risk.riskLevel === "critical"
                        ? "border-l-red-500 bg-red-50 border border-red-200"
                        : risk.riskLevel === "warning"
                          ? "border-l-amber-500 bg-amber-50 border border-amber-200"
                          : "border-l-blue-500 bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-full p-3 ${
                          risk.riskLevel === "critical"
                            ? "bg-red-100"
                            : risk.riskLevel === "warning"
                              ? "bg-amber-100"
                              : "bg-blue-100"
                        }`}
                      >
                        {risk.riskLevel === "critical" ? (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        ) : (
                          <CheckCircle
                            className={`w-6 h-6 ${
                              risk.riskLevel === "warning" ? "text-amber-600" : "text-blue-600"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-800">{risk.juiceName}</h4>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              risk.riskLevel === "critical"
                                ? "bg-red-200 text-red-800"
                                : risk.riskLevel === "warning"
                                  ? "bg-amber-200 text-amber-800"
                                  : "bg-blue-200 text-blue-800"
                            }`}
                          >
                            {risk.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700">{risk.recommendation}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SOURCING TAB */}
          {tabState.activeTab === "sourcing" && (
            <motion.div
              key="sourcing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Raw Ingredient Sourcing Priority
                </h3>
                <p className="text-sm text-gray-600">
                  Based on high-demand juice blend requirements
                </p>
              </div>

              {report.sourcingList.map((item, idx) => (
                <motion.div
                  key={item.ingredient}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{item.ingredient}</h4>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {item.juices.map((juice, i) => (
                          <span
                            key={i}
                            className="text-xs bg-organo-pistachio/20 text-organo-green px-2 py-1 rounded-full"
                          >
                            {juice}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        item.priority === "critical"
                          ? "bg-red-100 text-red-800"
                          : item.priority === "high"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Estimated Quantity:</strong> {item.estimatedQuantity}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* PRICING TAB */}
          {tabState.activeTab === "pricing" && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Dynamic Price Optimization
                </h3>
                <p className="text-sm text-gray-600">
                  Recommendations based on demand and elasticity
                </p>
              </div>

              {report.priceOptimizations.map((opt, idx) => (
                <motion.div
                  key={opt.juiceId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Juice</p>
                      <p className="font-bold text-gray-800">{opt.juiceName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Price</p>
                      <p className="font-bold text-gray-800">{formatCurrency(opt.currentPrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Suggested Price</p>
                      <p className="font-bold text-green-600">
                        {formatCurrency(opt.suggestedPrice)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{opt.rationale}</p>
                  <p className="text-xs text-gray-500 mt-2">Elasticity: {opt.elasticity}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* INVENTORY TAB */}
          {tabState.activeTab === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <DropletIcon className="w-5 h-5 text-purple-600" />
                  Inventory Optimization Recommendations
                </h3>
                <p className="text-sm text-gray-600">Reduce waste and prevent stockouts</p>
              </div>

              {optimizations.map((opt: OptimizationItem, idx: number) => (
                <motion.div
                  key={opt.item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Item</p>
                      <p className="font-bold text-gray-800">{opt.item}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Inventory</p>
                      <p className="font-medium text-gray-700">{opt.current}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recommended</p>
                      <p className="font-medium text-organo-green">{opt.recommended}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{opt.rationale}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* COMBOS TAB */}
          {tabState.activeTab === "combos" && (
            <motion.div
              key="combos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Smart Bundle Suggestions
                </h3>
                <p className="text-sm text-gray-600">
                  Move inventory faster with strategic juice combinations
                </p>
              </div>

              {combos.map((combo: BundleCombo, idx: number) => (
                <motion.div
                  key={combo.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-r from-white to-organo-pistachio/5 rounded-2xl border-2 border-organo-pistachio/30 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{combo.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{combo.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Bundle Price</p>
                      <p className="text-2xl font-bold text-organo-green">
                        {formatCurrency(combo.bundlePrice)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {combo.juices.map((juice: { id: number; name: string }) => (
                      <span
                        key={juice.id}
                        className="px-3 py-1 bg-white border border-organo-pistachio/30 rounded-full text-sm font-medium text-gray-700"
                      >
                        {juice.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Goal: {combo.targetGoal}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-6 mt-12 text-center"
      >
        <p className="text-sm text-gray-600">
          💡 These forecasts are AI-powered predictions based on historical demand patterns, market
          trends, and inventory levels.
          <br />
          <span className="text-xs text-gray-500">
            Update frequency: Daily | Next refresh: Tomorrow 6 AM
          </span>
        </p>
      </motion.div>
    </div>
  );
}
