import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ChevronDown,
  Leaf,
  MapPin,
  Menu,
  ShoppingBag,
  Sparkles,
  User,
  X,
  Search,
  Heart,
  Bell,
  Settings,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { FEATURED_SEARCHES, searchSite } from "../../lib/search";
import { useCart } from "../../features/cart/CartContext";
import { useAuth } from "../../features/auth/AuthContext";

const TRANSPARENT_HEADER_PATHS = ["/", "/the-farm", "/visit", "/wholesale", "/practices"];

const STORY_LINKS = [
  {
    label: "The Farm",
    to: "/the-farm",
    description: "See the land, people, and origin story behind every bottle.",
    match: ["/the-farm"],
  },
  {
    label: "Our Practices",
    to: "/practices",
    description: "Explore how we grow, press, and deliver with care.",
    match: ["/practices"],
  },
  {
    label: "Visit Us",
    to: "/visit",
    description: "Plan a tasting, pickup, or farm visit.",
    match: ["/visit"],
  },
  {
    label: "Journal",
    to: "/journal",
    description: "Read our wellness tips, recipes, and farm updates.",
    match: ["/journal"],
  },
];

const STORY_DROPDOWN_LINKS = [
  {
    label: "The Farm",
    to: "/the-farm",
    description: "See the land, people, and origin story behind every bottle.",
    match: ["/the-farm"],
    icon: Leaf,
  },
  {
    label: "Our Practices",
    to: "/practices",
    description: "Explore how we grow, press, and deliver with care.",
    match: ["/practices"],
    icon: Sparkles,
  },
  {
    label: "Visit Us",
    to: "/visit",
    description: "Plan a tasting, pickup, or farm visit.",
    match: ["/visit"],
    icon: MapPin,
  },
  {
    label: "Journal",
    to: "/journal",
    description: "Read our wellness tips, recipes, and farm updates.",
    match: ["/journal"],
    icon: Sparkles,
  },
];

const COMMERCE_LINKS = [
  {
    label: "Shop",
    to: "/shop",
    description: "Browse juices, fruits, vegetables, and pantry favorites.",
    match: ["/shop", "/product"],
  },
  {
    label: "Wholesale",
    to: "/wholesale",
    description: "Stock cafes, studios, and stores with fresh delivery.",
    match: ["/wholesale"],
  },
];

const AI_LINKS = [
  {
    label: "AI Advisor",
    to: "/ai-advisor",
    description: "Get goal-based juice suggestions in seconds.",
    icon: Sparkles,
    match: ["/ai-advisor"],
  },
  {
    label: "Wellness Hub",
    to: "/wellness-center",
    description: "See your operations and wellness insights together.",
    icon: Leaf,
    match: ["/wellness-center"],
  },
  {
    label: "Recommender",
    to: "/recommender",
    description: "Surface the best-fit blend for the moment.",
    icon: BrainCircuit,
    match: ["/recommender"],
  },
  {
    label: "Nutrition Assistant",
    to: "/nutrition-assistant",
    description: "Understand ingredients, benefits, and healthier swaps.",
    icon: Activity,
    match: ["/nutrition-assistant"],
  },
  {
    label: "Demand Forecasting",
    to: "/demand-forecasting",
    description: "Plan inventory and sourcing with smarter demand signals.",
    icon: BarChart3,
    match: ["/demand-forecasting", "/ai-demand"],
  },
];

const routeMatches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolledFromTop, setScrolledFromTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerControls = useAnimation();
  const { toggleCart, cartCount } = useCart();

  const notifications = [
    {
      id: 1,
      text: "Your subscription has been updated",
      time: "2 min ago",
      type: "success",
      read: false,
    },
    { id: 2, text: "New farm tour dates available", time: "1 hour ago", type: "info", read: false },
    {
      id: 3,
      text: "Your order is out for delivery",
      time: "3 hours ago",
      type: "success",
      read: true,
    },
    {
      id: 4,
      text: "Seasonal juices are now available",
      time: "5 hours ago",
      type: "promotion",
      read: false,
    },
  ];

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery, navigate]
  );

  const isTransparentPage = TRANSPARENT_HEADER_PATHS.includes(location.pathname);
  const isScrolled = scrolledFromTop || !isTransparentPage;
  const isElevated = isScrolled || isMobileMenuOpen;
  const storyMenuIsActive = routeMatches(
    location.pathname,
    STORY_LINKS.flatMap((item) => item.match)
  );
  const aiMenuIsActive = routeMatches(
    location.pathname,
    AI_LINKS.flatMap((item) => item.match)
  );
  const hasSearchQuery = searchQuery.trim().length > 0;
  const searchResults = searchSite(searchQuery, 6);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setScrolledFromTop(scrolled);

      // Animate header on scroll
      if (scrolled) {
        headerControls.start({
          y: 0,
          opacity: 1,
          transition: { duration: 0.3, ease: "easeOut" },
        });
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerControls]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotificationOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isUserMenuOpen && !target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
      if (isNotificationOpen && !target.closest(".notification-container")) {
        setIsNotificationOpen(false);
      }
      if (isSearchOpen && !target.closest(".search-container")) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen, isNotificationOpen, isSearchOpen]);

  useEffect(() => {
    const { body } = window.document;
    const originalOverflow = body.style.overflow;

    if (isMobileMenuOpen) {
      body.style.overflow = "hidden";
    }

    return () => {
      body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  const segmentClass = cn(
    "hidden lg:flex items-center gap-2 rounded-full border p-1.5 transition-all duration-300",
    isElevated
      ? "border-organo-green/10 bg-organo-green/[0.05]"
      : "border-white/15 bg-white/10 backdrop-blur-xl"
  );

  const actionButtonClass = cn(
    "relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 group",
    isElevated
      ? "border-organo-green/10 bg-white text-organo-green shadow-[0_8px_20px_rgba(28,67,52,0.12)] hover:-translate-y-0.5 hover:bg-organo-green hover:text-white hover:shadow-[0_12px_30px_rgba(28,67,52,0.25)] hover:scale-105"
      : "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/18 hover:shadow-[0_12px_30px_rgba(255,255,255,0.2)] hover:scale-105"
  );

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, -5, 5, 0],
      transition: {
        scale: { duration: 0.2 },
        rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
      },
    },
  };

  const renderDesktopLink = (
    item: { label: string; to: string; match: string[] },
    variant: "story" | "commerce"
  ) => {
    const isActive = routeMatches(location.pathname, item.match);

    return (
      <Link
        key={item.to}
        to={item.to}
        className={cn(
          "rounded-full transition-all duration-300",
          variant === "story"
            ? "px-4 py-2.5 font-serif text-[1.02rem] tracking-[0.01em]"
            : "px-4 py-2.5 font-sans text-[0.76rem] font-semibold uppercase tracking-[0.24em]",
          isActive
            ? isElevated
              ? "bg-organo-green text-white shadow-[0_12px_30px_rgba(37,99,77,0.28)]"
              : "bg-white text-organo-green shadow-[0_12px_30px_rgba(10,25,20,0.18)]"
            : isElevated
              ? "text-organo-gray hover:bg-organo-green/[0.08] hover:text-organo-green"
              : "text-white/84 hover:bg-white/12 hover:text-white"
        )}
      >
        {item.label}
      </Link>
    );
  };

  const renderMobileLink = (
    item: {
      label: string;
      to: string;
      description: string;
      match: string[];
      icon?: typeof Sparkles;
    },
    tone: "story" | "commerce" | "ai"
  ) => {
    const isActive = routeMatches(location.pathname, item.match);
    const Icon = item.icon;

    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          "group flex items-start gap-3 rounded-2xl border px-4 py-4 transition-all duration-300",
          isActive
            ? "border-organo-pistachio/70 bg-organo-pistachio text-organo-green shadow-[0_16px_40px_rgba(184,217,79,0.18)]"
            : "border-white/10 bg-white/6 text-white/88 hover:border-white/20 hover:bg-white/10"
        )}
      >
        <div
          className={cn(
            "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            isActive
              ? "bg-white/80 text-organo-green"
              : tone === "story"
                ? "bg-white/10 text-organo-pistachio"
                : tone === "commerce"
                  ? "bg-white/10 text-white"
                  : "bg-organo-pistachio/18 text-organo-pistachio"
          )}
        >
          {Icon ? <Icon size={18} /> : <ArrowRight size={18} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span
              className={cn(
                "font-semibold",
                tone === "story" ? "font-serif text-xl" : "text-sm uppercase tracking-[0.22em]"
              )}
            >
              {item.label}
            </span>
            <ArrowRight
              size={16}
              className={cn(
                "shrink-0 transition-transform duration-300",
                isActive
                  ? "text-organo-green"
                  : "text-white/40 group-hover:translate-x-1 group-hover:text-white"
              )}
            />
          </div>
          <p
            className={cn(
              "mt-1.5 text-sm leading-6",
              isActive ? "text-organo-green/80" : "text-white/62"
            )}
          >
            {item.description}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <motion.div
            className={cn(
              "relative mb-4 overflow-visible rounded-[24px] border px-4 py-2.5 transition-all duration-500 sm:px-5 lg:px-6",
              isElevated
                ? "border-white/80 bg-[rgba(249,249,245,0.85)] shadow-[0_16px_50px_rgba(16,44,35,0.15)] backdrop-blur-2xl backdrop-saturate-150"
                : "border-white/15 bg-white/10 shadow-[0_20px_60px_rgba(9,22,18,0.2)] backdrop-blur-xl backdrop-saturate-[1.1]"
            )}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 rounded-[24px]",
                isElevated
                  ? "bg-[radial-gradient(circle_at_top,rgba(184,217,79,0.12),transparent_55%),linear-gradient(135deg,rgba(255,255,255,0.38),rgba(255,255,255,0.16))]"
                  : "bg-[radial-gradient(circle_at_top,rgba(184,217,79,0.16),transparent_50%),linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]"
              )}
            />

            <div className="relative flex items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen((open) => !open)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 lg:hidden",
                    isElevated
                      ? "border-organo-green/10 bg-white text-organo-green shadow-[0_8px_20px_rgba(28,67,52,0.12)] hover:bg-organo-green hover:text-white"
                      : "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:bg-white/18"
                  )}
                >
                  {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                <div className="hidden items-center gap-4 lg:flex">
                  {/* Story Dropdown */}
                  <div className="group relative">
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-2 rounded-full px-4 py-2.5 font-serif text-[1.02rem] tracking-[0.01em] transition-all duration-300",
                        storyMenuIsActive
                          ? isElevated
                            ? "bg-organo-pistachio text-organo-green shadow-[0_12px_30px_rgba(184,217,79,0.28)]"
                            : "bg-white text-organo-green shadow-[0_12px_30px_rgba(10,25,20,0.18)]"
                          : isElevated
                            ? "text-organo-green hover:bg-organo-green/[0.08]"
                            : "text-white hover:bg-white/12 hover:text-white"
                      )}
                    >
                      <Leaf size={16} />
                      Our Story
                      <ChevronDown
                        size={14}
                        className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                      />
                    </button>

                    <div className="pointer-events-none absolute left-0 top-[calc(100%+24px)] z-50 w-[360px] translate-y-3 rounded-[28px] border border-organo-green/10 bg-[rgba(249,249,245,0.96)] p-3 opacity-0 shadow-[0_24px_80px_rgba(16,44,35,0.18)] backdrop-blur-2xl transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <div className="mb-3 flex items-center justify-between px-2">
                        <div>
                          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-organo-green/55">
                            Discover Our Journey
                          </div>
                          <div className="mt-1 font-serif text-2xl text-organo-green">
                            From farm to bottle
                          </div>
                        </div>
                        <div className="rounded-full bg-organo-pistachio px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-organo-green">
                          {STORY_DROPDOWN_LINKS.length} Stories
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {STORY_DROPDOWN_LINKS.map((item) => {
                          const Icon = item.icon;
                          const isActive = routeMatches(location.pathname, item.match);

                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              className={cn(
                                "group/item flex items-start gap-3 rounded-2xl p-3 transition-all duration-300",
                                isActive
                                  ? "bg-organo-green text-white"
                                  : "hover:bg-organo-green/[0.06]"
                              )}
                            >
                              <div
                                className={cn(
                                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                                  isActive
                                    ? "bg-white/15 text-organo-pistachio"
                                    : "bg-organo-green/[0.08] text-organo-green"
                                )}
                              >
                                <Icon size={18} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <div
                                    className={cn(
                                      "text-sm font-semibold uppercase tracking-[0.18em]",
                                      isActive ? "text-white" : "text-organo-green"
                                    )}
                                  >
                                    {item.label}
                                  </div>
                                  <ArrowRight
                                    size={15}
                                    className={cn(
                                      "transition-transform duration-300",
                                      isActive
                                        ? "text-organo-pistachio"
                                        : "text-organo-green/40 group-hover/item:translate-x-1 group-hover/item:text-organo-green"
                                    )}
                                  />
                                </div>
                                <p
                                  className={cn(
                                    "mt-1.5 text-sm leading-6",
                                    isActive ? "text-white/72" : "text-organo-gray"
                                  )}
                                >
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 justify-center lg:flex-none">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  onMouseEnter={() => setIsHoveringLogo(true)}
                  onMouseLeave={() => setIsHoveringLogo(false)}
                  className="group flex items-center gap-5 rounded-full px-5 py-3 transition-transform duration-300 hover:scale-[1.02]"
                >
                  <motion.div
                    variants={logoVariants}
                    initial="initial"
                    animate={isHoveringLogo ? "hover" : "initial"}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_12px_30px_rgba(16,44,35,0.18)] transition-all duration-300",
                      isElevated
                        ? "border-organo-green/10 bg-gradient-to-br from-organo-green to-organo-green/90 text-organo-pistachio"
                        : "border-white/15 bg-white/10 text-organo-pistachio backdrop-blur-xl"
                    )}
                  >
                    <Leaf size={18} className="drop-shadow-sm" />
                  </motion.div>
                  <div className="min-w-0 text-left">
                    <motion.div
                      className={cn(
                        "font-serif text-[1.25rem] font-bold tracking-[-0.02em] leading-none",
                        isElevated ? "text-organo-green" : "text-white"
                      )}
                      animate={{
                        textShadow: isHoveringLogo ? "0 0 20px rgba(184,217,79,0.5)" : "none",
                      }}
                    >
                      Organo
                    </motion.div>
                    <div
                      className={cn(
                        "hidden text-[0.48rem] uppercase tracking-[0.4em] sm:block mt-1",
                        isElevated ? "text-organo-gray/65" : "text-white/60"
                      )}
                    >
                      Pressed Fresh Daily
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex items-center justify-end gap-3">
                <div className="hidden items-center gap-4 lg:flex">
                  <div className={segmentClass}>
                    {COMMERCE_LINKS.map((item) => renderDesktopLink(item, "commerce"))}

                    <div className="group relative">
                      <button
                        type="button"
                        className={cn(
                          "flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[0.76rem] font-semibold uppercase tracking-[0.24em] transition-all duration-300",
                          aiMenuIsActive
                            ? isElevated
                              ? "bg-organo-pistachio text-organo-green shadow-[0_12px_30px_rgba(184,217,79,0.28)]"
                              : "bg-white text-organo-green shadow-[0_12px_30px_rgba(10,25,20,0.18)]"
                            : isElevated
                              ? "text-organo-green hover:bg-organo-green/[0.08]"
                              : "text-[#9CBF3A] hover:bg-white/12 hover:text-white"
                        )}
                      >
                        <Sparkles size={14} />
                        AI
                        <ChevronDown
                          size={14}
                          className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                        />
                      </button>

                      <div className="pointer-events-none absolute right-0 top-[calc(100%+24px)] z-50 w-[360px] translate-y-3 rounded-[28px] border border-organo-green/10 bg-[rgba(249,249,245,0.96)] p-3 opacity-0 shadow-[0_24px_80px_rgba(16,44,35,0.18)] backdrop-blur-2xl transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <div className="mb-3 flex items-center justify-between px-2">
                          <div>
                            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-organo-green/55">
                              Personalize Faster
                            </div>
                            <div className="mt-1 font-serif text-2xl text-organo-green">
                              AI wellness tools
                            </div>
                          </div>
                          <div className="rounded-full bg-organo-pistachio px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-organo-green">
                            {AI_LINKS.length} Tools
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {AI_LINKS.map((item) => {
                            const Icon = item.icon;
                            const isActive = routeMatches(location.pathname, item.match);

                            return (
                              <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                  "group/item flex items-start gap-3 rounded-2xl p-3 transition-all duration-300",
                                  isActive
                                    ? "bg-organo-green text-white"
                                    : "hover:bg-organo-green/[0.06]"
                                )}
                              >
                                <div
                                  className={cn(
                                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                                    isActive
                                      ? "bg-white/15 text-organo-pistachio"
                                      : "bg-organo-green/[0.08] text-organo-green"
                                  )}
                                >
                                  <Icon size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <div
                                      className={cn(
                                        "text-sm font-semibold uppercase tracking-[0.18em]",
                                        isActive ? "text-white" : "text-organo-green/90"
                                      )}
                                    >
                                      {item.label}
                                    </div>
                                    <ArrowRight
                                      size={15}
                                      className={cn(
                                        "transition-transform duration-300",
                                        isActive
                                          ? "text-organo-pistachio"
                                          : "text-organo-green/40 group-hover/item:translate-x-1 group-hover/item:text-organo-green"
                                      )}
                                    />
                                  </div>
                                  <p
                                    className={cn(
                                      "mt-1.5 text-sm leading-6",
                                      isActive ? "text-white/72" : "text-organo-gray"
                                    )}
                                  >
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/check-availability"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans text-[0.76rem] font-semibold uppercase tracking-[0.28em] transition-all duration-300",
                      isElevated
                        ? "bg-organo-green text-white shadow-[0_14px_36px_rgba(37,99,77,0.28)] hover:-translate-y-0.5 hover:bg-organo-green/90"
                        : "bg-white text-organo-green shadow-[0_18px_40px_rgba(10,25,20,0.2)] hover:-translate-y-0.5 hover:bg-organo-pistachio"
                    )}
                  >
                    <MapPin size={15} />
                    Check
                  </Link>
                </div>

                {/* User Menu */}
                <div className="relative user-menu-container">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) navigate("/account");
                      else setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 overflow-hidden",
                      isElevated
                        ? "border-organo-green/10 bg-white text-organo-green shadow-[0_10px_30px_rgba(28,67,52,0.12)] hover:-translate-y-0.5 hover:bg-organo-green hover:text-white"
                        : "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/18"
                    )}
                  >
                    <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-organo-pistachio to-organo-green flex items-center justify-center font-bold text-white text-xs">
                      {isAuthenticated && user?.name ? (
                        user.name.charAt(0).toUpperCase()
                      ) : (
                        <User size={16} className="text-white" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-[calc(100%+20px)] z-50 w-64"
                      >
                        <div className="rounded-2xl border border-organo-green/10 bg-[rgba(249,249,245,1)] p-2 shadow-[0_24px_80px_rgba(16,44,35,0.18)] backdrop-blur-2xl">
                          <div className="p-3 border-b border-organo-green/10">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-organo-pistachio to-organo-green flex items-center justify-center">
                                <User size={18} className="text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-organo-green">
                                  {user?.name || "User"}
                                </p>
                                <p className="text-xs text-organo-gray/60">{user?.email || ""}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-2 space-y-1">
                            <Link
                              to="/account"
                              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-organo-gray hover:bg-organo-green/10 hover:text-organo-green transition-colors"
                            >
                              <User size={16} />
                              My Account
                            </Link>
                            <Link
                              to="/wishlist"
                              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-organo-gray hover:bg-organo-green/10 hover:text-organo-green transition-colors"
                            >
                              <Heart size={16} />
                              Wishlist
                            </Link>
                            <Link
                              to="/subscription"
                              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-organo-gray hover:bg-organo-green/10 hover:text-organo-green transition-colors"
                            >
                              <Settings size={16} />
                              Subscription Settings
                            </Link>
                            <button className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-organo-gray hover:bg-organo-green/10 hover:text-organo-green transition-colors w-full text-left">
                              <Phone size={16} />
                              Contact Support
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={toggleCart}
                  className={actionButtonClass}
                  aria-label="Open cart"
                  type="button"
                >
                  <ShoppingBag
                    size={16}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-organo-gold px-1 text-[9px] font-bold text-organo-green shadow-[0_6px_14px_rgba(254,211,74,0.35)] animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Search Bar */}
                <div className="relative search-container">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
                      isElevated
                        ? "border-organo-green/10 bg-white text-organo-green shadow-[0_8px_20px_rgba(28,67,52,0.12)] hover:-translate-y-0.5 hover:bg-organo-green hover:text-white"
                        : "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/18"
                    )}
                  >
                    <Search size={16} />
                  </button>

                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-[calc(100%+20px)] z-50 w-[24rem] max-w-[calc(100vw-2rem)]"
                      >
                        <div className="overflow-hidden rounded-[26px] border border-organo-green/10 bg-[rgba(249,249,245,0.96)] shadow-[0_24px_80px_rgba(16,44,35,0.18)] backdrop-blur-2xl">
                          <form onSubmit={handleSearchSubmit} className="p-1">
                            <div className="flex items-center gap-3 rounded-[22px] bg-white px-4 py-3">
                              <Search size={18} className="text-organo-gray/50" />
                              <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search juices, ingredients, delivery, AI..."
                                className="flex-1 bg-transparent text-sm text-organo-gray placeholder-organo-gray/50 outline-none"
                              />
                              <button
                                type="button"
                                onClick={closeSearch}
                                className="rounded-full p-1 hover:bg-organo-gray/10 transition-colors"
                              >
                                <X size={16} className="text-organo-gray/50" />
                              </button>
                            </div>
                          </form>

                          {hasSearchQuery ? (
                            <>
                              <div className="border-t border-organo-green/10 px-4 py-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <div className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-organo-green/55">
                                      Quick Results
                                    </div>
                                    <div className="mt-1 text-sm text-organo-gray">
                                      {searchResults.length > 0
                                        ? `${searchResults.length} best matches for "${searchQuery.trim()}"`
                                        : `No quick matches for "${searchQuery.trim()}"`}
                                    </div>
                                  </div>
                                  <Link
                                    to={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                                    onClick={closeSearch}
                                    className="inline-flex items-center gap-2 rounded-full bg-organo-green px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-organo-green/90"
                                  >
                                    View all
                                    <ArrowRight size={13} />
                                  </Link>
                                </div>
                              </div>

                              <div className="max-h-80 overflow-y-auto p-2">
                                {searchResults.length > 0 ? (
                                  <div className="space-y-1.5">
                                    {searchResults.map((result) => (
                                      <Link
                                        key={result.id}
                                        to={result.to}
                                        onClick={closeSearch}
                                        className="group flex items-center gap-3 rounded-[20px] p-3 transition-colors hover:bg-organo-green/5"
                                      >
                                        {result.image ? (
                                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-organo-cream">
                                            <img
                                              src={result.image}
                                              alt={result.title}
                                              className="h-full w-full object-cover"
                                            />
                                          </div>
                                        ) : (
                                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-organo-green text-sm font-serif text-organo-pistachio">
                                            {result.section.slice(0, 1)}
                                          </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-organo-green/8 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-organo-green">
                                              {result.section}
                                            </span>
                                            {result.badge && (
                                              <span className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-organo-green/60">
                                                {result.badge}
                                              </span>
                                            )}
                                          </div>
                                          <div className="mt-1 truncate font-semibold text-organo-gray group-hover:text-organo-green">
                                            {result.title}
                                          </div>
                                          <div className="mt-0.5 truncate text-xs text-organo-gray/55">
                                            {result.priceLabel ?? result.description}
                                          </div>
                                        </div>

                                        <ArrowRight
                                          size={15}
                                          className="shrink-0 text-organo-green/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-organo-green"
                                        />
                                      </Link>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="px-2 py-6 text-center text-sm text-organo-gray/60">
                                    Try searching for a product name, ingredient, or page like
                                    "mango", "delivery", or "AI advisor".
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="border-t border-organo-green/10 px-4 py-4">
                              <div className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-organo-green/55">
                                Popular Searches
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {FEATURED_SEARCHES.map((query) => (
                                  <button
                                    key={query}
                                    type="button"
                                    onClick={() => setSearchQuery(query)}
                                    className="rounded-full border border-organo-green/10 bg-white px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-organo-green transition-colors hover:bg-organo-pistachio/20"
                                  >
                                    {query}
                                  </button>
                                ))}
                              </div>

                              <div className="mt-4 rounded-[20px] bg-white px-4 py-3">
                                <div className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-organo-green/55">
                                  Search Tips
                                </div>
                                <p className="mt-2 text-sm leading-6 text-organo-gray">
                                  Search by flavor, ingredient, wellness goal, or tool. Examples:
                                  "detox", "ginger", "subscription", or "nutrition assistant".
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notifications */}
                <div className="relative notification-container">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
                      isElevated
                        ? "border-organo-green/10 bg-white text-organo-green shadow-[0_8px_20px_rgba(28,67,52,0.12)] hover:-translate-y-0.5 hover:bg-organo-green hover:text-white"
                        : "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/18"
                    )}
                  >
                    <Bell size={16} />
                    {notifications.some((n) => !n.read) && (
                      <span className="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-organo-gold shadow-[0_4px_12px_rgba(254,211,74,0.4)] animate-pulse" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotificationOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-[calc(100%+20px)] z-50 w-80"
                      >
                        <div className="rounded-2xl border border-organo-green/10 bg-[rgba(249,249,245,1)] shadow-[0_24px_80px_rgba(16,44,35,0.18)] backdrop-blur-2xl overflow-hidden">
                          <div className="p-4 border-b border-organo-green/10">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-organo-green">Notifications</h3>
                              <button className="text-xs text-organo-gray/60 hover:text-organo-green transition-colors">
                                Mark all read
                              </button>
                            </div>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.map((notif) => (
                              <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: notif.id * 0.1 }}
                                className={cn(
                                  "flex items-start gap-3 p-4 border-b border-organo-green/5 last:border-b-0 hover:bg-organo-green/5 transition-colors cursor-pointer",
                                  !notif.read && "bg-organo-pistachio/5"
                                )}
                              >
                                <div
                                  className={cn(
                                    "mt-0.5 h-2 w-2 rounded-full flex-shrink-0",
                                    notif.type === "success"
                                      ? "bg-organo-pistachio"
                                      : notif.type === "promotion"
                                        ? "bg-organo-gold"
                                        : "bg-organo-green"
                                  )}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-organo-gray font-medium">
                                    {notif.text}
                                  </p>
                                  <p className="text-xs text-organo-gray/50 mt-1">{notif.time}</p>
                                </div>
                                {!notif.read && (
                                  <div className="w-2 h-2 rounded-full bg-organo-gold animate-pulse" />
                                )}
                              </motion.div>
                            ))}
                          </div>
                          <div className="p-3 border-t border-organo-green/10">
                            <button className="w-full text-center text-sm text-organo-green hover:text-organo-green/80 transition-colors font-medium">
                              View all notifications
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,57,45,0.96),rgba(14,43,35,0.98))]" />
            <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(184,217,79,0.22),transparent_62%)]" />
            <div className="relative h-full overflow-y-auto px-4 pb-12 pt-28 sm:px-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="mx-auto max-w-xl space-y-5"
              >
                <div className="rounded-[28px] border border-white/10 bg-white/7 p-6 backdrop-blur-2xl">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-organo-pistachio">
                    Navigation, refined
                  </div>
                  <h2 className="mt-3 max-w-sm font-serif text-4xl leading-tight text-white">
                    Everything important, easier to reach.
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-white/68">
                    Explore the farm, shop your routine, and jump straight into AI-powered tools
                    without digging through clutter.
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-2xl">
                  <div className="mb-3 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/48">
                    Story
                  </div>
                  <div className="space-y-3">
                    {STORY_LINKS.map((item) => renderMobileLink(item, "story"))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-2xl">
                  <div className="mb-3 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/48">
                    Shop & Delivery
                  </div>
                  <div className="space-y-3">
                    {COMMERCE_LINKS.map((item) => renderMobileLink(item, "commerce"))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-2xl">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/48">
                      AI Studio
                    </div>
                    <div className="rounded-full bg-organo-pistachio/14 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-organo-pistachio">
                      {AI_LINKS.length} tools
                    </div>
                  </div>
                  <div className="space-y-3">
                    {AI_LINKS.map((item) => renderMobileLink(item, "ai"))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    to="/check-availability"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-organo-pistachio px-5 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-organo-green shadow-[0_16px_40px_rgba(184,217,79,0.22)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <MapPin size={16} />
                    Check Delivery
                  </Link>

                  {isAuthenticated ? (
                    <Link
                      to="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-5 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white/12"
                    >
                      <div className="relative h-6 w-6 rounded-full bg-gradient-to-br from-organo-pistachio to-organo-green flex items-center justify-center font-bold text-white text-[10px]">
                        {user?.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          <User size={12} className="text-white" />
                        )}
                      </div>
                      {user?.name || "Account"}
                    </Link>
                  ) : (
                    <Link
                      to="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/8 px-2 py-4 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white/12 text-center leading-tight"
                    >
                      <User size={14} className="flex-shrink-0" />
                      <span>Sign in / Sign up</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      toggleCart();
                    }}
                    className="relative flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-5 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white/12"
                  >
                    <ShoppingBag size={16} />
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute right-4 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-organo-gold px-1 text-[10px] font-bold text-organo-green animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-5 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white/12"
                  >
                    <Heart size={16} />
                    Wishlist
                  </Link>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-2xl">
                  <div className="mb-3 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/48">
                    Quick Actions
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/8 px-3 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white/12">
                      <Phone size={14} />
                      Call Us
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/8 px-3 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white/12">
                      <Mail size={14} />
                      Email
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
