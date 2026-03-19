import { memo } from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

const FooterComponent = () => {
  return (
    <footer className="bg-organo-green text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <h2 className="font-serif text-4xl font-bold tracking-tighter">Organo</h2>
            <p className="text-white/80 max-w-sm leading-relaxed">
              Merging the patience of the soil with the speed of modern life. We are a working
              organic farm delivering cold-pressed vitality directly to your door.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-organo-pistachio hover:text-organo-green transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-organo-pistachio hover:text-organo-green transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-organo-pistachio hover:text-organo-green transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-sans font-bold uppercase tracking-widest text-organo-pistachio text-sm">
              Shop
            </h3>
            <ul className="space-y-4">
              {["All Juices", "Cleanses", "Farm Boxes", "Subscriptions", "Gift Cards"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h3 className="font-sans font-bold uppercase tracking-widest text-organo-pistachio text-sm">
              Support
            </h3>
            <ul className="space-y-4">
              {["FAQ", "Shipping & Returns", "Delivery Zones", "Contact Us", "Wholesale Login"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="font-sans font-bold uppercase tracking-widest text-organo-pistachio text-sm">
              Stay Rooted
            </h3>
            <p className="text-white/70">
              Join our community for seasonal harvest updates and exclusive recipes.
            </p>
            <form className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-organo-pistachio transition-colors"
              />
              <button className="bg-organo-pistachio text-organo-green font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-white transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-white/40">
          <p>&copy; 2025 Organo Farms. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-serif italic text-white/60">USDA Organic</span>
            <span>|</span>
            <span className="font-serif italic text-white/60">Non-GMO</span>
            <span>|</span>
            <span className="font-serif italic text-white/60">B-Corp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Footer = memo(FooterComponent);
