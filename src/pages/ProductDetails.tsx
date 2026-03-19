import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Leaf, Star, Heart, MapPin } from "lucide-react";
import { useCart } from "../features/cart/CartContext";
import { useWishlist } from "../features/wishlist/WishlistContext";
import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency, getProductImage } from "../lib/utils";

export const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { loading, error, getById } = useProducts();

  const product = id ? getById(id) : undefined;
  const imageSrc = product ? getProductImage(product) : "/images/placeholder.png";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-organo-cream flex items-center justify-center text-organo-gray">
        Loading...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-organo-cream flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-organo-green mb-4">Product not found</h2>
        <Link to="/shop" className="text-organo-green underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-organo-cream min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumb / Back */}
        <Link
          to="/shop"
          className="inline-flex items-center text-organo-gray hover:text-organo-green transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-bold uppercase tracking-wider text-sm">Back to Shop</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2"
          >
            <div className="rounded-3xl overflow-hidden shadow-xl bg-white aspect-[4/5] relative">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/placeholder.png";
                }}
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-organo-green uppercase tracking-wider shadow-sm">
                {product.tag || product.category}
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 text-organo-gold mb-4">
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <span className="text-organo-gray ml-2 text-sm font-bold">(128 Reviews)</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl text-organo-green mb-6">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-8">
              <span className="font-sans font-bold text-3xl text-organo-green">
                {formatCurrency(Number(product.price))}
              </span>
              <span className="text-organo-gray text-lg mb-1">/ {product.measurement}</span>
            </div>

            <p className="text-organo-gray text-lg leading-relaxed mb-8">{product.description}</p>

            <div className="flex gap-4 mb-12">
              <button
                onClick={() => void addToCart(product.id.toString())}
                className="flex-1 bg-organo-green text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-organo-pistachio hover:text-organo-green transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add to Cart
              </button>
              {/* Wishlist placeholder */}
              <button
                onClick={() => {
                      if (!product) return;
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist({
                          id: product.id,
                          name: product.name,
                          image: getProductImage(product),
                          price: product.price,
                        });
                      }
                    }}
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-colors ${
                  product && isInWishlist(product.id)
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                }`}
              >
                <Heart
                  size={24}
                  fill={product && isInWishlist(product.id) ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-10">
                <h3 className="font-serif text-2xl text-organo-green mb-4 flex items-center gap-2">
                  <Leaf size={24} className="text-organo-pistachio" />
                  Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing: string, i: number) => (
                    <span
                      key={i}
                      className="bg-white px-4 py-2 rounded-lg text-organo-green border border-gray-100 font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl text-organo-green mb-4">Benefits</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-organo-gray">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-organo-pistachio flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Traceability */}
            {(product.harvestDate || product.farmerName || product.origin) && (
              <div className="mt-12 bg-white rounded-2xl p-8 border border-organo-green/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-organo-pistachio/10 rounded-full blur-3xl opacity-50" />
                <h3 className="font-serif text-2xl text-organo-green mb-6 flex items-center gap-2 relative z-10">
                  <MapPin size={24} className="text-organo-pistachio" />
                  Farm to Fridge Traceability
                </h3>
                
                <div className="space-y-4 relative z-10">
                  {product.origin && (
                    <div className="flex border-b border-gray-100 pb-4">
                      <div className="w-1/3 text-organo-gray text-xs uppercase tracking-wider font-bold">Origin</div>
                      <div className="w-2/3 text-organo-green font-medium">{product.origin}</div>
                    </div>
                  )}
                  {product.farmerName && (
                    <div className="flex border-b border-gray-100 pb-4">
                      <div className="w-1/3 text-organo-gray text-xs uppercase tracking-wider font-bold">Grown By</div>
                      <div className="w-2/3 text-organo-green font-medium">{product.farmerName}</div>
                    </div>
                  )}
                  {product.harvestDate && (
                    <div className="flex pb-2">
                      <div className="w-1/3 text-organo-gray text-xs uppercase tracking-wider font-bold">Harvested On</div>
                      <div className="w-2/3 text-organo-green font-medium">
                        {new Date(product.harvestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
