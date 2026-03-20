import { useState } from "react";
import { useCart } from "../features/cart/CartContext";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Box, Truck } from "lucide-react";
import { cn, formatCurrency, getImageUrl } from "../lib/utils";
import { paymentService } from "../services/paymentService";
import { useAuth } from "../features/auth/AuthContext";

export const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const GST_RATE = 0.05;
  const bundleDiscountRate = items.length >= 3 ? 0.08 : 0;
  const subscriptionDiscountRate = 0.1; // can be 0.1–0.2
  const totalDiscountRate = Math.min(bundleDiscountRate + subscriptionDiscountRate, 0.2);
  const discountAmount = cartTotal * totalDiscountRate;
  const discountedSubtotal = cartTotal - discountAmount;
  const gstAmount = discountedSubtotal * GST_RATE;
  const deliveryFee = 0;
  const finalTotal = discountedSubtotal + gstAmount + deliveryFee;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const loadRazorpayScript = () =>
    new Promise<void>((resolve, reject) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setPaymentError("Please login to complete payment.");
      return;
    }
    try {
      setIsPaying(true);
      setPaymentError(null);
      await loadRazorpayScript();
      const paymentOrder = await paymentService.createOrder(token);
      const razorpay = new (window as any).Razorpay({
        key: paymentOrder.key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Organo",
        description: "Farm-to-bottle juice order",
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        handler: async (response: any) => {
          try {
            await paymentService.verify(token, response);
            clearCart();
            setStep(3);
            window.scrollTo(0, 0);
          } catch (err: any) {
            setPaymentError(err.message ?? "Payment verification failed");
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
        notes: { orderId: paymentOrder.orderId },
      });
      razorpay.open();
    } catch (err: any) {
      setPaymentError(err.message ?? "Payment failed to start");
      setIsPaying(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-organo-cream pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <Box size={64} className="text-organo-green/20 mb-6" />
        <h1 className="font-serif text-3xl text-organo-green mb-4">Your basket is empty</h1>
        <p className="text-organo-gray mb-8">Looks like you haven't added any fresh juices yet.</p>
        <Link
          to="/shop"
          className="bg-organo-green text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-organo-pistachio hover:text-organo-green transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
          <CheckCircle size={40} />
        </div>
        <h1 className="font-serif text-4xl text-organo-green mb-4">Order Confirmed!</h1>
        <p className="text-organo-gray max-w-md mx-auto mb-8">
          Thank you for your order. We've sent a confirmation email to you. Your fresh harvest will
          be on its way soon!
        </p>
        <div className="bg-gray-50 rounded-xl p-6 w-full max-w-md mb-8">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
            <span className="text-gray-500">Order Number</span>
            <span className="font-mono font-bold text-gray-900">#ORG-8392</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-bold text-gray-900">Tomorrow, by 6 PM</span>
          </div>
        </div>
        <Link
          to="/"
          className="text-organo-green font-bold uppercase tracking-wider hover:underline"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-organo-cream pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-7">
            {/* Breadcrumb / Back */}
            <Link
              to="/shop"
              className="inline-flex items-center text-gray-500 hover:text-organo-green mb-8 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Continue Shopping
            </Link>

            {/* Steps Indicator */}
            <div className="flex items-center space-x-4 mb-8 text-sm font-bold uppercase tracking-wider">
              <span
                className={cn(
                  "flex items-center",
                  step >= 1 ? "text-organo-green" : "text-gray-300"
                )}
              >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-2">
                  1
                </span>
                Shipping
              </span>
              <div className="h-px w-8 bg-gray-300"></div>
              <span
                className={cn(
                  "flex items-center",
                  step >= 2 ? "text-organo-green" : "text-gray-300"
                )}
              >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-2">
                  2
                </span>
                Payment
              </span>
            </div>

            {step === 1 ? (
              <form
                key="shipping-form"
                onSubmit={handleShippingSubmit}
                className="bg-white rounded-2xl shadow-sm p-8"
              >
                <h2 className="font-serif text-2xl text-organo-green mb-6 flex items-center">
                  <Truck className="mr-3" /> Shipping Details
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      First Name
                    </label>
                    <input
                      required
                      type="text"
                      name="firstName"
                      className="w-full p-3 bg-gray-50 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-organo-green"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Last Name
                    </label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      className="w-full p-3 bg-gray-50 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-organo-green"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-organo-green"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Street Address
                  </label>
                  <input
                    required
                    type="text"
                    name="streetAddress"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-organo-green"
                    placeholder="123 Orchard Lane"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Zip Code
                    </label>
                    <input
                      required
                      type="text"
                      name="zipCode"
                      className="w-full p-3 bg-gray-50 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-organo-green"
                      placeholder="10001"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      City
                    </label>
                    <input
                      required
                      type="text"
                      name="city"
                      className="w-full p-3 bg-gray-50 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-organo-green"
                      placeholder="New York"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-organo-green text-white font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-organo-green/90 transition-colors shadow-lg"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <form
                key="payment-form"
                onSubmit={handlePaymentSubmit}
                className="bg-white rounded-2xl shadow-sm p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl text-organo-green">Payment</h2>
                  <span className="text-sm text-organo-gray">Secure Razorpay checkout</span>
                </div>

                {paymentError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {paymentError}
                  </div>
                )}

                <div className="p-4 border border-organo-green/20 bg-organo-green/5 rounded-xl">
                  <p className="text-sm text-organo-green font-medium">
                    Amount to pay:{" "}
                    <span className="font-bold text-organo-green">
                      {formatCurrency(finalTotal)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    You will be redirected to Razorpay to complete the payment.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    type="button"
                    className="w-1/3 border border-gray-200 text-gray-600 font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isPaying}
                    className={cn(
                      "w-2/3 bg-organo-green text-white font-bold uppercase tracking-wider py-4 rounded-xl transition-colors shadow-lg",
                      isPaying
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-organo-pistachio hover:text-organo-green"
                    )}
                  >
                    {isPaying ? "Processing..." : `Pay ${formatCurrency(finalTotal)}`}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-32">
              <h3 className="font-serif text-xl text-organo-green mb-6">Order Summary</h3>

              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-organo-green">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                {bundleDiscountRate > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Bundle Discount ({Math.round(bundleDiscountRate * 100)}%)</span>
                    <span>-{formatCurrency(cartTotal * bundleDiscountRate)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Subscription Discount ({Math.round(subscriptionDiscountRate * 100)}%)</span>
                  <span>-{formatCurrency(cartTotal * subscriptionDiscountRate)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(discountedSubtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>{formatCurrency(gstAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-organo-green pt-4 border-t border-gray-100 mt-4">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
