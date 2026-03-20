import { motion } from "framer-motion";
import { ArrowRight, Clock, User } from "lucide-react";
// removed Link import
import { getImageUrl } from "../lib/utils";

const POSTS = [
  {
    id: "spicy-mango-tang-mocktail",
    title: "Spicy Mango Tang Mocktail",
    excerpt: "Turn your daily dose of Organic Mango Tang into a refreshing sunset mocktail with jalapeño and lime.",
    category: "Recipe",
    image: "/images/spicy_mango_tang.png",
    author: "Elena Rodriguez",
    readTime: "5 min read",
  },
  {
    id: "sweet-potato-harvest-bowl",
    title: "The Ultimate Sweet Potato Harvest Bowl",
    excerpt: "Roasted organic sweet potatoes, kale, and a zesty Citrus Sun dressing make for the perfect autumn lunch.",
    category: "Recipe",
    image: "/images/sweet_potatoes.png",
    author: "Sarah Jenkins",
    readTime: "12 min read",
  },
  {
    id: "gut-health-101",
    title: "Gut Health 101: Why Beet It is Your Best Friend",
    excerpt: "Discover the science behind beetroot and ginger, and how they work together to heal your microbiome.",
    category: "Wellness",
    image: "/images/beet_it.png",
    author: "Dr. David Miller",
    readTime: "8 min read",
  },
  {
    id: "spring-cleanse-guide",
    title: "Your 3-Day Spring Cleanse Protocol",
    excerpt: "Feeling sluggish? Reboot your system with our guided 3-day juice cleanse featuring Celery Calm and Green Glow.",
    category: "Guide",
    image: "/images/celery_calm.png",
    author: "Wellness Team",
    readTime: "10 min read",
  }
];

export const Journal = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-organo-cream">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-organo-pistachio font-bold tracking-widest uppercase mb-4 block">
            Organo Journal
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-organo-green mb-6">
            Wellness & Recipes
          </h1>
          <p className="text-organo-gray max-w-2xl mx-auto text-lg leading-relaxed">
            Nourish your body and mind with our collection of wholesome recipes, farm updates, and holistic health guides.
          </p>
        </div>

        {/* Featured Post */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 bg-white rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/5 relative min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2784&auto=format&fit=crop" 
                alt="Featured recipe" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/5 p-10 md:p-14 flex flex-col justify-center">
              <span className="text-organo-pistachio font-bold uppercase tracking-wider text-sm mb-4">Featured Recipe</span>
              <h2 className="font-serif text-3xl md:text-4xl text-organo-green mb-4">Summer Berry Blast Smoothie Bowl</h2>
              <p className="text-organo-gray mb-8 leading-relaxed">
                Start your morning right with an antioxidant-packed bowl featuring our Berry Blast juice, fresh blueberries, and homemade granola.
              </p>
              <div className="flex items-center text-sm text-gray-500 gap-6 mb-8">
                <div className="flex items-center gap-2"><User size={16} /> Sarah Jenkins</div>
                <div className="flex items-center gap-2"><Clock size={16} /> 10 min read</div>
              </div>
              <button className="bg-organo-green text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-organo-mist hover:text-organo-green transition-colors self-start flex items-center gap-2">
                Read Article <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {POSTS.map((post, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={post.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={getImageUrl(post.image)} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-organo-green uppercase tracking-wider">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif text-xl text-organo-green font-bold mb-3 group-hover:text-organo-pistachio transition-colors">
                  {post.title}
                </h3>
                <p className="text-organo-gray text-sm leading-relaxed mb-6 flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4 mt-auto">
                  <span>{post.author}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
