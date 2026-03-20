import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, CheckCircle, Truck, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { checkAvailability, type DeliveryStatus } from "../../data/zipCodes";

export const ZoneGate = () => {
  const [zipCode, setZipCode] = useState("");
  const [status, setStatus] = useState<DeliveryStatus>("idle");

  const checkZone = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkAvailability(zipCode);
    setStatus(result);
  };

  return (
    <section
      id="availability"
      className="bg-organo-cream py-10 relative z-10 rounded-t-3xl md:rounded-none shadow-xl md:shadow-none border-b border-gray-200"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Input Area */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-serif text-2xl text-organo-green mb-4">What's fresh near you?</h3>
            <form onSubmit={checkZone} className="relative">
              <input
                type="text"
                placeholder="Enter Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:border-organo-green transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-organo-green text-white p-2 rounded-md hover:bg-organo-gray transition-colors"
                aria-label="Check"
              >
                <MapPin size={18} />
              </button>
            </form>
            {status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={cn(
                  "mt-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2",
                  status === "local"
                    ? "bg-organo-pistachio/20 text-organo-green"
                    : status === "national"
                      ? "bg-organo-gold/20 text-yellow-800"
                      : "bg-red-50 text-red-600"
                )}
              >
                {status === "invalid" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                {status === "local" && "Local Delivery Available! Raw juices unlocked."}
                {status === "national" && "National Shipping Available for HPP Juices."}
                {status === "invalid" && "Please enter a valid 6-digit zip code."}
              </motion.div>
            )}
          </div>

          {/* Value Props */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-organo-green shadow-sm">
                <Calendar size={24} />
              </div>
              <div>
                <h4 className="font-bold text-organo-green mb-1">24hr Harvest</h4>
                <p className="text-sm text-gray-500">
                  From soil to press in under a day for maximum nutrients.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-organo-green shadow-sm">
                <div className="font-bold text-xl leading-none">35°</div>
              </div>
              <div>
                <h4 className="font-bold text-organo-green mb-1">Cold-Pressed</h4>
                <p className="text-sm text-gray-500">
                  Never heated. Enzymes and vitamins preserved intact.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-organo-green shadow-sm">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-organo-green mb-1">Eco-Delivery</h4>
                <p className="text-sm text-gray-500">
                  Zero-emission local delivery in our electric fleet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
