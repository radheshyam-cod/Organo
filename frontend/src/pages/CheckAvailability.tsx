import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, CheckCircle, Truck, AlertCircle, Clock, Leaf } from "lucide-react";
import { cn } from "../lib/utils";
import { checkAvailability, type DeliveryStatus } from "../data/zipCodes";
import { DeliveryMap } from "../components/visit/DeliveryMap";

export const CheckAvailability = () => {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<DeliveryStatus>("idle");
  const [waitlist, setWaitlist] = useState({ name: "", contact: "" });
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const checkZone = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = checkAvailability(pincode);
    setStatus(result);
  };

  const handleMapSelection = (pin: string) => {
    setPincode(pin);
    // Automatically check availability when map selects a zip
    // We use a timeout to allow the state to update first, or we can just pass the zip directly to checkAvailability
    const result = checkAvailability(pin);
    setStatus(result);
  };

  return (
    <div className="bg-organo-cream min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Hero / Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-organo-green font-bold uppercase tracking-widest mb-4 block">
              Delivery Zones
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-organo-green mb-6">
              Check Your Availability
            </h1>
            <p className="text-xl text-organo-gray leading-relaxed">
              We deliver our raw, unpasteurized juices locally within specific zones to ensure
              maximum freshness. For our friends further away, we offer HPP juice shipping
              nationwide.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20 items-start">
          {/* Map Section */}
          <div className="order-2 lg:order-1">
            <DeliveryMap onPincodeSelected={handleMapSelection} searchedPincode={pincode} />
          </div>

          {/* Checker & Results */}
          <div className="order-1 lg:order-2 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full flex flex-col justify-center">
            <h3 className="font-serif text-2xl text-organo-green mb-6 text-center">
              Delivery near you (India)
            </h3>
            <form onSubmit={checkZone} className="relative mb-6">
              <input
                type="text"
                placeholder="e.g. 560001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-4 pl-6 pr-14 text-lg focus:outline-none focus:border-organo-green transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-organo-green text-white p-3 rounded-md hover:bg-organo-gray transition-colors"
                aria-label="Check"
              >
                <MapPin size={24} />
              </button>
            </form>

            {status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={cn(
                  "p-6 rounded-xl text-center border",
                  status === "local"
                    ? "bg-organo-pistachio/20 border-organo-pistachio text-organo-green"
                    : status === "national"
                      ? "bg-organo-gold/20 border-organo-gold text-yellow-800"
                      : "bg-red-50 border-red-100 text-red-600"
                )}
              >
                <div className="flex justify-center mb-3">
                  {status === "invalid" ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
                </div>
                <h4 className="font-bold text-lg mb-1">
                  {status === "local" && "Currently serving in your area"}
                  {status === "national" && "Same-day delivery available"}
                  {status === "invalid" && "Out of service right now"}
                </h4>
                <p>
                  {status === "local" &&
                    "Delivery in 10–30 mins • Cold-pressed today • Farm delivered within hours"}
                  {status === "national" &&
                    "Same-day delivery across the city. Freshly pressed, packed cold, and rushed to you."}
                  {status === "invalid" &&
                    "We're expanding routes. Join the waitlist and we'll ping you the moment we go live in your pincode."}
                </p>
              </motion.div>
            )}

            {status === "idle" && (
              <div className="text-center text-organo-gray/60 italic mt-4">
                <p>Enter code or use the map to check</p>
              </div>
            )}

            {status === "invalid" && (
              <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                {waitlistSubmitted ? (
                  <p className="text-organo-green font-semibold">
                    Added to waitlist. We'll notify you when we start serving{" "}
                    {pincode || "your area"}!
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mb-3">
                      Get notified when we open in your area.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={waitlist.name}
                        onChange={(e) => setWaitlist((w) => ({ ...w, name: e.target.value }))}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-organo-green"
                      />
                      <input
                        type="tel"
                        placeholder="Mobile (10 digits)"
                        pattern="^[6-9][0-9]{9}$"
                        value={waitlist.contact}
                        onChange={(e) => setWaitlist((w) => ({ ...w, contact: e.target.value }))}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-organo-green"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setWaitlistSubmitted(true)}
                      className="mt-4 w-full bg-organo-green text-white font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-organo-pistachio hover:text-organo-green transition-colors"
                    >
                      Join Waitlist
                    </button>
                  </>
                )}
              </div>
            )}

            {(status === "local" || status === "national") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 bg-organo-green/10 text-organo-green rounded-lg p-3">
                  <Clock size={18} />
                  <div>
                    <p className="text-sm font-semibold">
                      {status === "local" ? "Delivery in 10–30 mins" : "Same-day delivery"}
                    </p>
                    <p className="text-xs text-organo-green/80">Live tracked dispatch</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-organo-pistachio/15 text-organo-green rounded-lg p-3">
                  <Leaf size={18} />
                  <div>
                    <p className="text-sm font-semibold">Cold-pressed today</p>
                    <p className="text-xs text-organo-green/80">Farm delivered within hours</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="p-4 bg-organo-cream rounded-full text-organo-green mb-6">
              <Calendar size={32} />
            </div>
            <h3 className="font-serif text-xl font-bold text-organo-green mb-3">24hr Harvest</h3>
            <p className="text-organo-gray">
              Our produce goes from soil to press in under 24 hours effectively capturing peak
              nutrients.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="p-4 bg-organo-cream rounded-full text-organo-green mb-6">
              <div className="font-bold text-2xl leading-none font-serif">35°</div>
            </div>
            <h3 className="font-serif text-xl font-bold text-organo-green mb-3">Cold-Pressed</h3>
            <p className="text-organo-gray">
              Never heated. Our hydraulic press extracts nectar without destroying enzymes and
              vitamins.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="p-4 bg-organo-cream rounded-full text-organo-green mb-6">
              <Truck size={32} />
            </div>
            <h3 className="font-serif text-xl font-bold text-organo-green mb-3">Eco-Delivery</h3>
            <p className="text-organo-gray">
              Zero-emission local delivery in our electric fleet. Sustainable from farm to doorstep.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
