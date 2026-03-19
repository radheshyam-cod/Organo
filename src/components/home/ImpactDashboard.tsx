import { useRef } from "react";
import { useInView } from "framer-motion";

const Stat = ({
  value,
  label,
  prefix = "",
  suffix = "",
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="text-center p-8 bg-organo-cream rounded-3xl border border-organo-green/10 shadow-sm"
    >
      <h3 className="text-5xl md:text-6xl font-sans font-bold text-organo-green mb-2">
        {prefix}
        {isInView ? <Counter to={value} /> : 0}
        {suffix}
      </h3>
      <p className="text-organo-gray uppercase tracking-widest font-bold text-sm">{label}</p>
    </div>
  );
};

const Counter = ({ to }: { to: number }) => {
  // Simplified counter for demo (in production use framer-motion/animate)
  return <span>{to.toLocaleString()}</span>;
};

export const ImpactDashboard = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl">
            <span className="text-organo-gold font-bold uppercase tracking-wider mb-2 block">
              Our Impact
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-organo-green">
              Good for the Soil, Good for the Soul.
            </h2>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
              {/* Placeholder for B-Corp Logo */}
              <span className="text-[10px] font-bold">B-Corp</span>
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
              {/* Placeholder for 1% Logo */}
              <span className="text-[10px] font-bold">1%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Stat value={5000} label="Lbs Food Waste Diverted" prefix="" suffix="+" />
          <Stat value={200} label="Local Families Fed" />
          <Stat value={100} label="Plastic-Free Packaging" suffix="%" />
        </div>
      </div>
    </section>
  );
};
