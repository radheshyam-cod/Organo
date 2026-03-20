import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Factory, Leaf, Truck } from "lucide-react";

export const Wholesale = () => {
  return (
    <div className="bg-organo-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2874&auto=format&fit=crop"
            alt="Organic Farming"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-organo-pistachio font-bold tracking-widest uppercase mb-4 block">
              Partner With Us
            </span>
            <h1 className="font-serif text-5xl md:text-7xl mb-6 drop-shadow-xl">
              Bring the Harvest to Your Customers
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Premium, cold-pressed juices and farm boxes for cafes, retailers, and corporate
              offices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Leaf className="w-8 h-8" />,
                title: "Farm to Bottle",
                desc: "Sourced directly from our regenerative farm. No middlemen.",
              },
              {
                icon: <Factory className="w-8 h-8" />,
                title: "Small Batch Production",
                desc: "Cold-pressed daily to ensure maximum nutrient retention.",
              },
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Reliable Logistics",
                desc: "Cold-chain delivery schedule tailored to your business needs.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="text-organo-green mb-6 bg-organo-green/10 w-16 h-16 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-serif text-2xl text-organo-green mb-4">{item.title}</h3>
                <p className="text-organo-gray">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
            <div className="md:w-1/2">
              <h2 className="font-serif text-4xl text-organo-green mb-6">Let's Grow Together</h2>
              <p className="text-organo-gray mb-8">
                Tell us about your business and estimated volume. Our team will get back to you with
                a tailored proposal within 24 hours.
              </p>
              <ul className="space-y-4">
                {[
                  "Competitive Wholesale Pricing",
                  "Marketing Support & Assets",
                  "Dedicated Account Manager",
                ].map((item) => (
                  <li key={item} className="flex items-center text-organo-gray font-medium">
                    <CheckCircle2 className="text-organo-green mr-3" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2 bg-organo-cream p-8 rounded-2xl">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-organo-green text-organo-gray"
                    placeholder="e.g. The Daily Cafe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-organo-green text-organo-gray"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-organo-green text-organo-gray"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-2">
                    Message / Volume Estimate
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-organo-green text-organo-gray"
                    placeholder="We serve about 200 customers daily..."
                  />
                </div>
                <button className="w-full bg-organo-green text-white font-bold uppercase tracking-wider py-4 rounded-lg hover:bg-organo-green/90 transition-colors flex items-center justify-center gap-2">
                  Send Inquiry <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
