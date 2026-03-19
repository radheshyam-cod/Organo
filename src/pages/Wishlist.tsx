import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "../features/wishlist/WishlistContext";
import { useCart } from "../features/cart/CartContext";
import { formatCurrency, getProductImage } from "../lib/utils";

export const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="bg-organo-cream min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-organo-green fill-organo-green" size={32} />
          <h1 className="font-serif text-4xl text-organo-green">Your Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <Heart size={64} className="mx-auto text-organo-pistachio mb-6" />
            <h2 className="font-serif text-2xl text-organo-green mb-2">Your wishlist is empty</h2>
            <p className="text-organo-gray mb-8">Save items you love to find them easily later.</p>
            <Link
              to="/shop"
              className="inline-block bg-organo-green text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-organo-pistachio hover:text-organo-green transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/placeholder.png";
                    }}
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-serif text-xl text-organo-green font-bold mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-lg text-organo-green">
                        {formatCurrency(Number(product.price))}
                      </span>
                      <span className="text-xs text-gray-400 block">{product.measurement}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-organo-pistachio/20 text-organo-green px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-organo-pistachio transition-colors flex items-center gap-2"
                    >
                      <ShoppingBag size={16} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
