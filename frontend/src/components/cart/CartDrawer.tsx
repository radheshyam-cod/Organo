import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../features/cart/CartContext";
import { formatCurrency, cn, getImageUrl } from "../../lib/utils";

const FREE_SHIPPING_THRESHOLD = 1500;

const CartDrawerComponent = () => {
  const { items, isOpen, toggleCart, removeFromCart, updateQuantity, cartTotal, addToCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = useCallback(() => {
    toggleCart();
    navigate("/checkout");
  }, [navigate, toggleCart]);

  const progress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeeded = FREE_SHIPPING_THRESHOLD - cartTotal;
  const isGingerShotInCart = items.some(item => item.id === "20" || item.name === "Ginger Shot");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-organo-green flex items-center gap-2">
                <ShoppingBag /> Your Harvest
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {items.length > 0 && (
              <div className="bg-organo-cream/50 px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-organo-green">
                    {amountNeeded > 0
                      ? `${formatCurrency(amountNeeded)} away from Free Shipping`
                      : "You've unlocked Free Delivery! 🎉"}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full transition-colors duration-300",
                      progress === 100 ? "bg-organo-pistachio" : "bg-organo-green"
                    )}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-organo-gray/60">
                  <ShoppingBag size={64} className="opacity-20" />
                  <p className="text-lg">Your bag is empty.</p>
                  <Link
                    to="/shop"
                    onClick={toggleCart}
                    className="text-organo-green font-bold uppercase tracking-wider text-sm hover:underline"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg text-organo-green">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            {formatCurrency(Number(item.price))}
                          </span>
                          <span className="text-organo-gray text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {item.measurement}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-white rounded-md transition-colors text-organo-green disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-organo-green px-2 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-white rounded-md transition-colors text-organo-green"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && !isGingerShotInCart && (
              <div className="p-4 mx-6 mb-4 bg-[rgba(249,249,245,1)] border border-organo-pistachio/40 rounded-xl flex items-center gap-4 shadow-sm">
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-black/5">
                  <img src={getImageUrl("/images/ginger_shot.png")} alt="Ginger Shot" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-sm font-bold text-organo-green">Add a Ginger Shot?</h4>
                  <p className="text-xs text-organo-gray mb-3">Boost immunity for just {formatCurrency(60)}</p>
                  <button 
                    onClick={() => addToCart("20")}
                    className="text-[0.65rem] font-bold uppercase tracking-[0.1em] bg-white border border-organo-green text-organo-green px-4 py-2 rounded-full hover:bg-organo-green hover:text-white transition-colors w-full"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            )}

            {items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-organo-gray">Subtotal</span>
                  <span className="font-serif text-2xl text-organo-green font-bold">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-organo-green text-white font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-organo-green/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">
                  Shipping & taxes calculated at checkout.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

CartDrawerComponent.displayName = "CartDrawer";

export const CartDrawer = memo(CartDrawerComponent);
