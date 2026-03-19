import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sprout, Droplets, Bug, Sun, RefreshCw, HeartHandshake } from "lucide-react";

export const Practices = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="bg-organo-cream min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <img
            src="/images/regenerative_farming.png"
            alt="Regenerative Farming"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-organo-pistachio font-bold tracking-widest uppercase mb-4 block">
              Beyond Organic
            </span>
            <h1 className="font-serif text-5xl md:text-7xl mb-6 drop-shadow-xl">
              Regenerative by Design
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              We don't just sustain the land; we heal it. Every bottle starts with soil that is
              alive, diverse, and thriving.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-organo-green mb-4">Our Core Principles</h2>
            <div className="w-24 h-1 bg-organo-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Sprout className="w-10 h-10" />,
                title: "Soil Health First",
                desc: "We use no-till methods and cover cropping to sequester carbon and build rich, living topsoil.",
              },
              {
                icon: <Bug className="w-10 h-10" />,
                title: "Biodiversity",
                desc: "Integrated pest management through beneficial insects and pollinator habitats, not chemicals.",
              },
              {
                icon: <Droplets className="w-10 h-10" />,
                title: "Water Stewardship",
                desc: "Drip irrigation and rainwater harvesting ensure every drop is used efficiently.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center"
              >
                <div className="text-organo-green mb-6 bg-organo-cream w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-serif text-2xl text-organo-green mb-4">{item.title}</h3>
                <p className="text-organo-gray leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Cycle Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=2621&auto=format&fit=crop"
                alt="Composting"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="lg:w-1/2">
              <span className="text-organo-green font-bold uppercase tracking-widest mb-2 block">
                The Cycle
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-organo-green mb-6">
                Nothing is Wasted
              </h2>
              <p className="text-organo-gray text-lg mb-8 leading-relaxed">
                Our farm operates on a closed-loop system. Juice pulp returns to the earth as
                compost, feeding the next generation of crops. By reclaiming waste, we reduce our
                footprint and mimic nature’s own cycles of renewal.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <RefreshCw />, text: "100% of pulp is composted" },
                  { icon: <Sun />, text: "Solar-powered irrigation systems" },
                  { icon: <HeartHandshake />, text: "Fair wages for all farm workers" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="text-organo-pistachio bg-organo-green p-2 rounded-full">
                      {item.icon}
                    </div>
                    <span className="font-sans font-bold text-organo-gray">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
