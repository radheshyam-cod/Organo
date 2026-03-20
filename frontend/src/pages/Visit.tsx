import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, Mail, Sun } from "lucide-react";
import { BookingModal } from "../components/visit/BookingModal";

export const Visit = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="bg-organo-cream min-h-screen">
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2938&auto=format&fit=crop"
            alt="Organo Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-organo-green/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl mb-6">Visit The Farm</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Walk the soil, taste the freshness, and meet the farmers behind your food.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-20 -mt-20 relative z-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-organo-green">
            {/* Location */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <MapPin className="w-8 h-8 mb-4 text-organo-pistachio" />
              <h3 className="font-serif text-2xl mb-2">Find Us</h3>
              <p className="text-organo-gray">
                123 Harvest Lane
                <br />
                Hudson Valley, NY 12534
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=123+Harvest+Lane+Hudson+Valley+NY+12534"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm font-bold uppercase tracking-wider border-b-2 border-organo-green hover:text-organo-pistachio hover:border-organo-pistachio transition-colors"
              >
                Get Directions
              </a>
            </div>

            {/* Hours */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Clock className="w-8 h-8 mb-4 text-organo-pistachio" />
              <h3 className="font-serif text-2xl mb-2">Farm Stand Hours</h3>
              <div className="text-organo-gray space-y-1">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span>8am - 6pm</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Sat - Sun</span>
                  <span>7am - 4pm</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Mail className="w-8 h-8 mb-4 text-organo-pistachio" />
              <h3 className="font-serif text-2xl mb-2">Get in Touch</h3>
              <div className="text-organo-gray space-y-2">
                <a
                  href="mailto:hello@organo.farm"
                  className="flex items-center gap-2 hover:text-organo-green transition-colors"
                >
                  <span>hello@organo.farm</span>
                </a>
                <a
                  href="tel:+15551234567"
                  className="flex items-center gap-2 hover:text-organo-green transition-colors"
                >
                  <span>(555) 123-4567</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events / Tours */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <span className="text-organo-green font-bold uppercase tracking-widest mb-2 block">
                Experiences
              </span>
              <h2 className="font-serif text-4xl text-organo-green mb-6">Weekend Farm Tours</h2>
              <p className="text-organo-gray mb-6 text-lg">
                Join us every Saturday at 10 AM for a guided tour of our regenerative fields. Learn
                about soil health, harvest your own veggies, and enjoy a fresh juice tasting.
              </p>
              <div className="flex items-center gap-4 text-organo-gray font-medium mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="text-organo-pistachio" size={20} />
                  <span>Saturdays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-organo-pistachio" size={20} />
                  <span>10:00 AM - 12:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="text-organo-pistachio" size={20} />
                  <span>Weather Permitting</span>
                </div>
              </div>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="bg-organo-green text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-organo-green/90 transition-all shadow-lg hover:translate-y-[-2px]"
              >
                Book a Tour
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2942&auto=format&fit=crop"
                alt="Farm Tour"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
