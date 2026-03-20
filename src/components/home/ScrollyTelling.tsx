import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn, getImageUrl } from "../../lib/utils";

export const ScrollyTelling = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const steps = [
    {
      id: 1,
      title: "Grown in Ojai",
      desc: "Our regenerative soil captures carbon and fuels nutrient density. Tended by Head Farmer Mateo.",
      image: getImageUrl("/images/ojai_farm.png"),
    },
    {
      id: 2,
      title: "Cold-Pressed at 35°F",
      desc: "Harvested at dawn, pressed by noon. We use 10 tons of pressure to extract every drop of vitality without heat.",
      image:
        "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=2787&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Delivered Zero-Emission",
      desc: "From our farm to your glass in reusable glass bottles. We pick up your empties on the next run.",
      image: getImageUrl("/images/zero_emission_delivery.png"),
    },
  ];

  return (
    <section ref={containerRef} className="relative py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="text-center mb-24">
          <h2 className="font-serif text-5xl text-organo-green mb-6">Seed to Sip</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            Trace the journey of your juice. No middlemen, no warehouses, just radical transparency.
          </p>
        </div>

        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-48 bottom-48 w-1 bg-gray-100 -translate-x-1/2 hidden md:block">
          <motion.div
            style={{ scaleY: pathLength, transformOrigin: "top" }}
            className="w-full h-full bg-organo-pistachio"
          />
        </div>

        <div className="space-y-32">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col md:flex-row items-center gap-12 relative",
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full md:w-1/2 text-center md:text-left p-6 md:p-12 bg-white/50 backdrop-blur-sm rounded-2xl md:bg-transparent"
              >
                <div className="inline-block px-4 py-1 rounded-full bg-organo-cream text-organo-green font-bold text-sm uppercase tracking-wider mb-4 border border-organo-green/10">
                  Step 0{step.id}
                </div>
                <h3 className="font-serif text-4xl text-organo-green mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.desc}</p>
              </motion.div>

              {/* Dot on line */}
              <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-organo-green rounded-full z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
