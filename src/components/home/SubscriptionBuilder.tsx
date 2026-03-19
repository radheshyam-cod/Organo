import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Box } from "lucide-react";
import { useSubscription } from "../../features/subscriptions/SubscriptionContext";
import { formatCurrency } from "../../lib/utils";

const ADDONS = [
  { id: 1, name: "Ginger Shots", price: 40, icon: "🫚" },
  { id: 2, name: "Almond Milk", price: 80, icon: "🥛" },
  { id: 3, name: "Kale Bunch", price: 30, icon: "🥬" },
  { id: 4, name: "Turmeric Roots", price: 50, icon: "🥕" },
];

export const SubscriptionBuilder = () => {
  const [crate, setCrate] = useState<{ id: number; name: string; icon: string }[]>([]);
  const navigate = useNavigate();
  const { addSubscription } = useSubscription();

  const addToCrate = (item: { id: number; name: string; icon: string }) => {
    if (crate.length < 6) {
      setCrate([...crate, item]);
    }
  };

  const removeFromCrate = (index: number) => {
    const newCrate = [...crate];
    newCrate.splice(index, 1);
    setCrate(newCrate);
  };

  const handleSubscribe = () => {
    if (crate.length === 0) return;

    addSubscription({
      productName: "Custom Wellness Crate",
      description: `A personalized selection containing: ${crate.map((i: { name: string }) => i.name).join(", ")}`,
      frequency: "Weekly",
      nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: 490.0,
      image:
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=2000&auto=format&fit=crop",
    });

    navigate("/account");
  };

  return (
    <section className="py-24 bg-organo-green relative overflow-hidden text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B8D94F_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Customize Your Crate</h2>
          <p className="text-white/70 text-lg">
            Build a weekly subscription that fits your lifestyle. Drag, drop, and sip.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Crate Visual */}
          <div className="w-full lg:w-1/2">
            <div className="bg-[#3e7561] border-4 border-[#2c5345] rounded-xl p-8 min-h-[400px] relative shadow-2xl">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-organo-gold text-organo-green px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg border border-organo-green">
                Your Box ({crate.length}/6)
              </div>

              <div className="grid grid-cols-3 gap-4 h-full">
                <AnimatePresence>
                  {crate.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      layout
                      className="aspect-square bg-organo-cream/10 rounded-lg flex flex-col items-center justify-center relative group cursor-pointer border border-white/5 hover:bg-white/20 transition-colors"
                      onClick={() => removeFromCrate(index)}
                    >
                      <span className="text-4xl shadow-sm filter drop-shadow-lg">{item.icon}</span>
                      <span className="text-xs mt-2 text-white/80 font-medium">{item.name}</span>
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Minus size={24} />
                      </div>
                    </motion.div>
                  ))}
                  {Array.from({ length: 6 - crate.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="aspect-square border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center text-white/20"
                    >
                      <Box size={24} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-sm text-white/50 block">Weekly Total</span>
                  <span className="text-2xl font-bold font-sans">{formatCurrency(490)}</span>
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={crate.length === 0}
                  className={`bg-organo-pistachio text-organo-green font-bold uppercase tracking-wider px-8 py-3 rounded-full shadow-lg transition-all transform duration-200 ${
                    crate.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-white hover:scale-105 active:scale-95"
                  }`}
                >
                  Start Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="w-full lg:w-1/2">
            <h3 className="font-serif text-2xl mb-6 text-organo-pistachio">Add Extras</h3>
            <div className="grid grid-cols-2 gap-4">
              {ADDONS.map((addon) => (
                <motion.button
                  key={addon.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCrate(addon)}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between group hover:bg-white/20 transition-all border border-white/5"
                  disabled={crate.length >= 6}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl bg-white/10 p-2 rounded-lg">{addon.icon}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm tracking-wide">{addon.name}</div>
                        + ₹{addon.price}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-organo-pistachio text-organo-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={16} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
