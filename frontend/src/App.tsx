import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/home/Hero";
import { CartDrawer } from "./components/cart/CartDrawer";
import { CartProvider } from "./features/cart/CartContext";

import { AuthProvider } from "./features/auth/AuthContext";
import { WishlistProvider } from "./features/wishlist/WishlistContext";
import { OrderProvider } from "./features/orders/OrderContext";
import { SubscriptionProvider } from "./features/subscriptions/SubscriptionContext";

const ZoneGate = lazy(() =>
  import("./components/home/ZoneGate").then((m) => ({ default: m.ZoneGate }))
);
const ProductCarousel = lazy(() =>
  import("./components/home/ProductCarousel").then((m) => ({ default: m.ProductCarousel }))
);
const ScrollyTelling = lazy(() =>
  import("./components/home/ScrollyTelling").then((m) => ({ default: m.ScrollyTelling }))
);
const SubscriptionBuilder = lazy(() =>
  import("./components/home/SubscriptionBuilder").then((m) => ({ default: m.SubscriptionBuilder }))
);
const ImpactDashboard = lazy(() =>
  import("./components/home/ImpactDashboard").then((m) => ({ default: m.ImpactDashboard }))
);
const SmartRecommender = lazy(() =>
  import("./components/home/SmartRecommender").then((m) => ({ default: m.SmartRecommender }))
);

const Shop = lazy(() => import("./pages/Shop").then((m) => ({ default: m.Shop })));
const Subscription = lazy(() =>
  import("./pages/Subscription").then((m) => ({ default: m.Subscription }))
);
const Wholesale = lazy(() => import("./pages/Wholesale").then((m) => ({ default: m.Wholesale })));
const Visit = lazy(() => import("./pages/Visit").then((m) => ({ default: m.Visit })));
const Practices = lazy(() => import("./pages/Practices").then((m) => ({ default: m.Practices })));
const Wishlist = lazy(() => import("./pages/Wishlist").then((m) => ({ default: m.Wishlist })));
const TheFarm = lazy(() => import("./pages/TheFarm").then((m) => ({ default: m.TheFarm })));
const Account = lazy(() => import("./pages/Account").then((m) => ({ default: m.Account })));
const Checkout = lazy(() => import("./pages/Checkout").then((m) => ({ default: m.Checkout })));
const CheckAvailability = lazy(() =>
  import("./pages/CheckAvailability").then((m) => ({ default: m.CheckAvailability }))
);
const ProductDetails = lazy(() =>
  import("./pages/ProductDetails").then((m) => ({ default: m.ProductDetails }))
);
const AIAdvisor = lazy(() => import("./pages/AIAdvisor").then((m) => ({ default: m.AIAdvisor })));
const AIDemand = lazy(() => import("./pages/AIDemand").then((m) => ({ default: m.AIDemand })));
const NutritionAssistant = lazy(() =>
  import("./pages/NutritionAssistant").then((m) => ({ default: m.NutritionAssistant }))
);
const DemandForecasting = lazy(() => import("./pages/DemandForecasting"));
const RealTimeRecommender = lazy(() => import("./pages/RealTimeRecommender"));
const WellnessOperationsCenter = lazy(() => import("./pages/WellnessOperationsCenter"));
const SearchPage = lazy(() => import("./pages/Search").then((m) => ({ default: m.SearchPage })));
const Journal = lazy(() => import("./pages/Journal").then((m) => ({ default: m.Journal })));

// Routes that have hero sections with full-screen images
const HERO_ROUTES = ["/", "/the-farm", "/visit", "/practices", "/wholesale"];

const AnimatedRoutes = () => {
  const location = useLocation();
  const hasHero = HERO_ROUTES.some(
    (route) => location.pathname === route || location.pathname.startsWith(`${route}/`)
  );
  const sectionFallback = <div className="py-12 text-center text-organo-gray">Loading...</div>;

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={hasHero ? "" : "pt-20"}
      >
        <Suspense
          fallback={<div className="py-24 text-center text-organo-gray">Loading experience...</div>}
        >
          <Routes location={location}>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Suspense fallback={sectionFallback}>
                    <ZoneGate />
                  </Suspense>
                  <Suspense fallback={sectionFallback}>
                    <ProductCarousel />
                  </Suspense>
                  <Suspense fallback={sectionFallback}>
                    <SmartRecommender />
                  </Suspense>
                  <Suspense fallback={sectionFallback}>
                    <ScrollyTelling />
                  </Suspense>
                  <Suspense fallback={sectionFallback}>
                    <SubscriptionBuilder />
                  </Suspense>
                  <Suspense fallback={sectionFallback}>
                    <ImpactDashboard />
                  </Suspense>
                </>
              }
            />
            <Route path="/wellness-center" element={<WellnessOperationsCenter />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/wholesale" element={<Wholesale />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/practices" element={<Practices />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/the-farm" element={<TheFarm />} />
            <Route
              path="/account"
              element={
                <OrderProvider>
                  <Account />
                </OrderProvider>
              }
            />
            <Route
              path="/checkout"
              element={
                <OrderProvider>
                  <Checkout />
                </OrderProvider>
              }
            />
            <Route path="/check-availability" element={<CheckAvailability />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
            <Route path="/ai-demand" element={<AIDemand />} />
            <Route path="/nutrition-assistant" element={<NutritionAssistant />} />
            <Route path="/demand-forecasting" element={<DemandForecasting />} />
            <Route path="/recommender" element={<RealTimeRecommender />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <SubscriptionProvider>
          <CartProvider>
            <div className="min-h-screen bg-gradient-to-b from-organo-cream via-white to-organo-cream font-sans text-organo-gray selection:bg-organo-pistachio selection:text-organo-green">
              <Header />
              <CartDrawer />
              <AnimatedRoutes />
              <Footer />
            </div>
          </CartProvider>
        </SubscriptionProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
