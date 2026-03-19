import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative h-screen min-h-[800px] w-full flex flex-col md:flex-row overflow-hidden bg-organo-green">
      {/* Left Side - The Farm */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2938&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-organo-green/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-organo-green/90 to-transparent md:bg-gradient-to-r md:from-transparent md:to-organo-green/90" />
      </div>

      {/* Right Side - The Juice */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-[url('/images/organo_delivery.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Center Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center md:max-w-4xl mx-auto"
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-tight drop-shadow-lg mb-6">
            <span className="block">Rooted in Soil.</span>
            <span className="block text-organo-pistachio italic">Pressed for You.</span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pointer-events-auto">
            <Link to="/shop">
              <button className="group relative px-8 py-4 bg-organo-pistachio text-organo-green font-bold text-lg uppercase tracking-wider rounded-full overflow-hidden transition-transform hover:scale-105 shadow-xl hover:shadow-2xl hover:bg-white">
                <span className="relative z-10 flex items-center gap-2">
                  Shop the Harvest <ArrowRight size={20} />
                </span>
              </button>
            </Link>

            <Link to="/the-farm">
              <button className="group flex items-center gap-3 px-8 py-4 border border-white/30 text-white font-medium uppercase tracking-wider rounded-full backdrop-blur-sm hover:bg-white/10 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-organo-green group-hover:scale-110 transition-transform">
                  <Play size={12} fill="currentColor" />
                </span>
                <span>Watch the Journey</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
      </motion.div>
    </section>
  );
};
