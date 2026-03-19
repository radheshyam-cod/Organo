import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ShoppingBag,
  BarChart2,
  Sparkles,
} from "lucide-react";
import { generateDemandReport, type DemandEntry } from "../ai/demandPredictor";

const LEVEL_COLORS: Record<
  DemandEntry["level"],
  { bg: string; text: string; bar: string; badge: string }
> = {
  high: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    bar: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    bar: "bg-gradient-to-r from-amber-400 to-yellow-400",
    badge: "bg-amber-100 text-amber-700",
  },
  low: {
    bg: "bg-red-50",
    text: "text-red-700",
    bar: "bg-gradient-to-r from-red-400 to-rose-400",
    badge: "bg-red-100 text-red-700",
  },
};

const TREND_ICONS: Record<DemandEntry["trend"], React.ReactNode> = {
  up: <TrendingUp size={14} className="text-emerald-500" />,
  stable: <Minus size={14} className="text-gray-400" />,
  down: <TrendingDown size={14} className="text-red-500" />,
};

const PRIORITY_COLORS = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
};

export const AIDemand = () => {
  const report = useMemo(() => generateDemandReport(), []);

  const stats = {
    high: report.entries.filter((e) => e.level === "high").length,
    medium: report.entries.filter((e) => e.level === "medium").length,
    low: report.entries.filter((e) => e.level === "low").length,
  };

  return (
    <div className="min-h-screen bg-organo-cream pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-organo-green/10 text-organo-green px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            AI-Powered
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-organo-green mb-4">
            Demand Intelligence
          </h1>
          <p className="text-organo-gray text-lg max-w-xl mx-auto">
            Predictive demand analysis for the week of{" "}
            <strong className="text-organo-green">{report.weekLabel}</strong>
          </p>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "High Demand",
              count: stats.high,
              icon: "🟢",
              bg: "from-emerald-500 to-teal-600",
            },
            {
              label: "Medium Demand",
              count: stats.medium,
              icon: "🟡",
              bg: "from-amber-400 to-yellow-500",
            },
            { label: "Low Demand", count: stats.low, icon: "🔴", bg: "from-rose-500 to-red-600" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${stat.bg} text-white rounded-2xl p-6 shadow-xl`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-bold font-serif mb-1">{stat.count}</div>
              <div className="text-white/80 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demand Bar Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-organo-pistachio/20 rounded-full flex items-center justify-center text-organo-green">
              <BarChart2 size={20} />
            </div>
            <div>
              <h2 className="font-serif text-xl text-organo-green">Predicted Demand by Product</h2>
              <p className="text-sm text-gray-400">This week's forecast — higher is better</p>
            </div>
          </div>

          <div className="space-y-3">
            {report.entries.map((entry, i) => {
              const colors = LEVEL_COLORS[entry.level];
              return (
                <motion.div
                  key={entry.juiceId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-4 p-3 rounded-xl ${colors.bg} group`}
                >
                  {/* Trend icon */}
                  <div className="w-5 flex justify-center flex-shrink-0">
                    {TREND_ICONS[entry.trend]}
                  </div>

                  {/* Name */}
                  <div className="w-40 flex-shrink-0">
                    <span className="text-sm font-bold text-organo-green truncate block">
                      {entry.juiceName}
                    </span>
                    <span className={`text-xs font-medium ${colors.text}`}>{entry.tag}</span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 bg-white/70 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${entry.demandScore}%` }}
                      transition={{ delay: 0.2 + i * 0.04, duration: 0.6, ease: "easeOut" }}
                      className={`h-full ${colors.bar} rounded-full`}
                    />
                  </div>

                  {/* Score */}
                  <div className="w-12 text-right flex-shrink-0">
                    <span className={`text-sm font-bold ${colors.text}`}>{entry.demandScore}</span>
                  </div>

                  {/* Level badge */}
                  <div
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0 ${colors.badge}`}
                  >
                    {entry.level}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Waste & Sourcing panels */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Reduce Waste */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-rose-500" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-organo-green">Reduce Waste</h2>
                <p className="text-xs text-gray-400">Low-demand products this week</p>
              </div>
            </div>

            {report.wasteRisk.length > 0 ? (
              <div className="space-y-4">
                {report.wasteRisk.map((item, i) => (
                  <motion.div
                    key={item.juiceId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="border border-rose-100 rounded-xl p-4 bg-rose-50"
                  >
                    <div className="font-bold text-organo-green text-sm mb-1">{item.juiceName}</div>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.recommendation}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">
                🎉 No waste risk items this week!
              </p>
            )}
          </motion.div>

          {/* Sourcing Priority */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-organo-pistachio/20 rounded-full flex items-center justify-center text-organo-green">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="font-serif text-xl text-organo-green">Optimize Sourcing</h2>
                <p className="text-xs text-gray-400">Key ingredients to stock up on</p>
              </div>
            </div>

            <div className="space-y-3">
              {report.sourcingList.map((item, i) => (
                <motion.div
                  key={item.ingredient}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full border flex-shrink-0 mt-0.5 ${PRIORITY_COLORS[item.priority]}`}
                  >
                    {item.priority}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-organo-green">{item.ingredient}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Used in: {item.juices.join(", ")}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
