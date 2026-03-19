import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Play, Droplet, Sun, Users } from "lucide-react";

export const TheFarm = () => {
  const [isPlaying, setIsPlaying] = useState(false);
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
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop"
            alt="The Farm Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-organo-pistachio font-bold tracking-widest uppercase mb-4 block">
              Since 1985
            </span>
            <h1 className="font-serif text-5xl md:text-7xl mb-6 drop-shadow-xl">
              Rooted in Tradition
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Four decades of nurturing the soil, the soul, and the community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Video Journey */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-organo-pistachio font-bold tracking-widest uppercase mb-2 block">
              The Journey
            </span>
            <h2 className="font-serif text-4xl text-organo-green">Why Organo?</h2>
          </div>

          {/* Video Player Placeholder */}
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl mb-16 group cursor-pointer bg-black">
            {!isPlaying ? (
              <div onClick={() => setIsPlaying(true)} className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1595855709940-1e5746739578?q=80&w=2940&auto=format&fit=crop"
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg">
                      <Play size={32} className="text-organo-green" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white pointer-events-none">
                  <h3 className="font-serif text-2xl md:text-3xl mb-2">
                    From Our Soil to Your Soul
                  </h3>
                  <p className="opacity-90">Watch how we harvest nature's best. (From YouTube)</p>
                </div>
              </div>
            ) : (
              <video
                src="/video/Organic_Juice_Brand_Video.mp4"
                title="Organic Farming Video"
                autoPlay
                controls
                className="w-full h-full"
              />
            )}
          </div>

          {/* The Pillars */}
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center px-4">
              <div className="w-16 h-16 bg-organo-pistachio/20 rounded-full flex items-center justify-center mx-auto mb-6 text-organo-green">
                <Sun size={32} />
              </div>
              <h3 className="font-serif text-xl text-organo-green font-bold mb-3">
                Holistic Farming
              </h3>
              <p className="text-organo-gray leading-relaxed">
                We practice regenerative agriculture, enriching the soil rather than depleting it.
                Every crop is grown without synthetic pesticides, ensuring a harvest that is as pure
                as nature intended.
              </p>
            </div>
            <div className="text-center px-4">
              <div className="w-16 h-16 bg-organo-pistachio/20 rounded-full flex items-center justify-center mx-auto mb-6 text-organo-green">
                <Droplet size={32} />
              </div>
              <h3 className="font-serif text-xl text-organo-green font-bold mb-3">
                Cold-Pressed Potency
              </h3>
              <p className="text-organo-gray leading-relaxed">
                Unlike traditional juicing, our hydraulic press technology extracts nectar without
                heat. This preserves 100% of the vital enzymes, vitamins, and minerals for maximum
                nourishment.
              </p>
            </div>
            <div className="text-center px-4">
              <div className="w-16 h-16 bg-organo-pistachio/20 rounded-full flex items-center justify-center mx-auto mb-6 text-organo-green">
                <Users size={32} />
              </div>
              <h3 className="font-serif text-xl text-organo-green font-bold mb-3">
                Community Rooted
              </h3>
              <p className="text-organo-gray leading-relaxed">
                Organo isn't just a farm; it's a collective. We support local agricultural education
                and provide fair-wage employment, growing a healthier community alongside our crops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story / History */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <span className="text-organo-green font-bold uppercase tracking-widest mb-2 block">
                Our Story
              </span>
              <h2 className="font-serif text-4xl text-organo-green mb-6">It Started with a Seed</h2>
              <p className="text-organo-gray text-lg mb-6 leading-relaxed">
                Organo began as a small family plot in the Hudson Valley with a simple mission: to
                grow food that heals. What started with a handful of heirlooms has blossomed into a
                200-acre regenerative ecosystem.
              </p>
              <p className="text-organo-gray text-lg mb-8 leading-relaxed">
                We believe farming is more than just production; it's a stewardship responsbility.
                Every decision we make is guided by the health of the land for future generations.
              </p>
              <div className="flex gap-8">
                <div className="text-center">
                  <h4 className="font-serif text-4xl text-organo-green mb-1">40+</h4>
                  <span className="text-sm font-bold text-organo-gray uppercase tracking-wide">
                    Years Farming
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="font-serif text-4xl text-organo-green mb-1">200</h4>
                  <span className="text-sm font-bold text-organo-gray uppercase tracking-wide">
                    Acres Protected
                  </span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute -inset-4 border-2 border-organo-pistachio rounded-2xl z-0 transform rotate-3" />
              <img
                src="/images/founder_in_field.png"
                alt="Founder in field"
                className="rounded-2xl shadow-xl relative z-10 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-organo-green mb-4">Meet the Growers</h2>
            <p className="text-organo-gray max-w-xl mx-auto">
              The hands and hearts dedicated to bringing you the freshest harvest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Jenkins",
                role: "Head Farmer",
                img: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2371&auto=format&fit=crop",
              },
              {
                name: "David Miller",
                role: "Soil Specialist",
                img: "https://images.unsplash.com/photo-1549421263-6064833b071b?q=80&w=2755&auto=format&fit=crop",
              },
              {
                name: "Elena Rodriguez",
                role: "Harvest Manager",
                img: "/images/elena_rodriguez.png",
              },
            ].map((member, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-4 relative">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-organo-green/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <h3 className="text-white font-serif text-2xl">{member.name}</h3>
                    <p className="text-organo-pistachio font-bold uppercase tracking-wider text-sm">
                      {member.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards / Certifications */}
      <section className="py-20 bg-organo-green text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["USDA Organic", "Regenerative Certified", "Non-GMO Project", "B-Corp Certified"].map(
              (cert, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-4 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Award className="w-12 h-12 text-organo-pistachio" />
                  <span className="font-bold tracking-wider">{cert}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
