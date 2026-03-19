import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  LogOut,
  Package,
  RefreshCw,
  Calendar,
  Heart,
  Truck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";
import { useOrder } from "../features/orders/OrderContext";
import { Link } from "react-router-dom";
import { useSubscription } from "../features/subscriptions/SubscriptionContext";
import { formatCurrency } from "../lib/utils";
import { HealthCheckIn } from "../components/account/HealthCheckIn";

export const Account = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [savedPlan, setSavedPlan] = useState<any>(null);

  const { orders } = useOrder();
  const { subscriptions, pauseSubscription, resumeSubscription, cancelSubscription, skipSubscription, swapSubscription } =
    useSubscription();
  const { user, login, signup, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user) {
      const plans = JSON.parse(localStorage.getItem("organo_saved_plans") || "{}");
      if (plans[user.email]) {
        setSavedPlan(plans[user.email]);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.type === "text" ? "name" : e.target.type]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const ok = await login(formData.email, formData.password);
      if (!ok) setError("Invalid email or password.");
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required.");
        return;
      }
      const ok = await signup(formData.name, formData.email, formData.password);
      if (!ok) setError("Signup failed");
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="bg-organo-cream min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="bg-organo-green p-8 text-white flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-serif text-3xl text-organo-gold">Hello, {user.name}!</h1>
                    <span className="bg-organo-gold/20 text-organo-gold text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-organo-gold/50">
                      Wholesale
                    </span>
                  </div>
                  <p className="text-white/80 mb-2">{user.email}</p>
                  <div className="flex items-center text-sm text-organo-pistachio/80">
                    <Calendar size={14} className="mr-2" />
                    <span>Account active</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors backdrop-blur-sm"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>

              <div className="p-8">
                <h2 className="font-serif text-2xl text-organo-green mb-6">
                  Your Harvest Dashboard
                </h2>

                <div className="mb-8">
                  <HealthCheckIn />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-100 rounded-xl p-6 bg-gray-50 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-organo-pistachio/20 rounded-full flex items-center justify-center text-organo-green">
                        <Package size={24} />
                      </div>
                      <h3 className="font-bold text-lg text-organo-green">Active Orders</h3>
                    </div>

                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-white p-4 rounded-lg border border-gray-100"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-organo-green font-bold block">
                                  {order.id}
                                </span>
                                <span className="text-xs text-gray-500">{order.date}</span>
                              </div>
                              <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                                {order.status}
                              </span>
                            </div>

                            {/* Order Images */}
                            <div className="flex gap-2 mb-3 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="w-12 h-12 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="text-sm text-gray-600 mb-2">
                              {order.items.length} items • {formatCurrency(order.total)}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Truck size={12} className="mr-1" />
                              Est: {order.estimatedDelivery}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-organo-gray">You have no active orders.</p>
                    )}
                  </div>

                  <div className="border border-gray-100 rounded-xl p-6 bg-gray-50 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-organo-pistachio/20 rounded-full flex items-center justify-center text-organo-green">
                        <RefreshCw size={24} />
                      </div>
                      <h3 className="font-bold text-lg text-organo-green">Subscriptions</h3>
                    </div>

                    {subscriptions.length > 0 ? (
                      <div className="space-y-4">
                        {subscriptions.map((sub) => (
                          <div
                            key={sub.id}
                            className="bg-white p-4 rounded-lg border border-gray-100 relative"
                          >
                            <div className="flex gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={sub.image}
                                  alt={sub.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-serif text-organo-green leading-tight">
                                  {sub.productName}
                                </h4>
                                <p className="text-xs text-gray-500 mb-1">{sub.frequency}</p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                      sub.status === "Active"
                                        ? "bg-green-100 text-green-700"
                                        : sub.status === "Paused"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {sub.status}
                                  </span>
                                  <span className="text-sm font-bold">
                                    {formatCurrency(sub.price)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {sub.status !== "Cancelled" && (
                              <div className="mt-3 flex gap-2 justify-end flex-wrap">
                                <button
                                  onClick={() => {
                                    const newName = prompt("Enter new product name to swap to:");
                                    if (newName) swapSubscription(sub.id, newName);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-bold border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors"
                                >
                                  Swap Items
                                </button>
                                <button
                                  onClick={() => skipSubscription(sub.id)}
                                  className="text-xs text-purple-600 hover:text-purple-700 font-bold border border-purple-200 hover:bg-purple-50 px-3 py-1 rounded-md transition-colors"
                                >
                                  Skip Next
                                </button>
                                {sub.status === "Active" ? (
                                  <button
                                    onClick={() => pauseSubscription(sub.id)}
                                    className="text-xs text-yellow-600 hover:text-yellow-700 font-bold border border-yellow-200 hover:bg-yellow-50 px-3 py-1 rounded-md transition-colors"
                                  >
                                    Pause
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => resumeSubscription(sub.id)}
                                    className="text-xs text-green-600 hover:text-green-700 font-bold border border-green-200 hover:bg-green-50 px-3 py-1 rounded-md transition-colors"
                                  >
                                    Resume
                                  </button>
                                )}
                                <button
                                  onClick={() => cancelSubscription(sub.id)}
                                  className="text-xs text-red-600 hover:text-red-700 font-bold border border-red-200 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            <div className="mt-2 text-xs text-gray-400">
                              Next delivery: {sub.nextDelivery}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-organo-gray mb-4">You have no active subscriptions.</p>
                        <Link
                          to="/subscription"
                          className="text-organo-green font-bold uppercase text-sm hover:underline"
                        >
                          Start a Subscription
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/wishlist"
                    className="border border-gray-100 rounded-xl p-6 bg-gray-50 hover:shadow-lg transition-shadow block"
                  >
                    <div className="w-12 h-12 bg-organo-pistachio/20 rounded-full flex items-center justify-center text-organo-green mb-4">
                      <Heart size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-organo-green mb-2">My Wishlist</h3>
                    <p className="text-organo-gray">View and manage your saved products.</p>
                  </Link>

                  {savedPlan ? (
                    <div className="border border-gray-100 rounded-xl p-6 bg-green-50 hover:shadow-lg transition-shadow block">
                      <div className="w-12 h-12 bg-organo-green/20 rounded-full flex items-center justify-center text-organo-green mb-4">
                        <Sparkles size={24} />
                      </div>
                      <h3 className="font-bold text-lg text-organo-green mb-2">
                        My Nutrition Plan
                      </h3>
                      <p className="text-organo-green/80 text-sm mb-3">
                        Customized for {savedPlan.userProfile.goal.replace("-", " ")}
                      </p>
                      <Link
                        to="/ai-advisor/nutrition-assistant"
                        className="text-organo-green font-bold text-sm hover:underline"
                      >
                        View Plan Details →
                      </Link>
                    </div>
                  ) : (
                    <div className="border border-gray-100 rounded-xl p-6 bg-gray-50 hover:shadow-lg transition-shadow block relative overflow-hidden">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-4">
                        <Sparkles size={24} />
                      </div>
                      <h3 className="font-bold text-lg text-gray-700 mb-2">No Nutrition Plan</h3>
                      <p className="text-gray-500 text-sm mb-3">
                        Generate a personalized juice plan based on your health goals.
                      </p>
                      <Link
                        to="/nutrition-assistant"
                        className="text-organo-green font-bold text-sm hover:underline"
                      >
                        Create Your Plan →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-organo-cream min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="bg-organo-cream w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-organo-green">
              <User size={32} />
            </div>
            <h1 className="font-serif text-3xl text-organo-green mb-2">
              {isLogin ? "Welcome Back" : "Join the Harvest"}
            </h1>
            <p className="text-organo-gray">
              {isLogin
                ? "Sign in to manage your subscriptions and orders."
                : "Create an account to track your farm-fresh deliveries."}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-organo-green focus:border-transparent text-organo-gray"
                    placeholder="Jane Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-organo-green focus:border-transparent text-organo-gray"
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-organo-green uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-organo-green focus:border-transparent text-organo-gray"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}

            <button className="w-full bg-organo-green text-white font-bold uppercase tracking-wider py-4 rounded-lg hover:bg-organo-green/90 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 duration-200">
              {isLogin ? "Sign In" : "Create Account"} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({ name: "", email: "", password: "" });
              }}
              className="text-organo-gray hover:text-organo-green font-medium text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
