import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search as SearchIcon, Sparkles } from "lucide-react";
import { FEATURED_SEARCHES, searchSite } from "../lib/search";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeQuery = searchParams.get("q")?.trim() ?? "";
  const [inputValue, setInputValue] = useState(activeQuery);

  const results = searchSite(activeQuery, 24);

  useEffect(() => {
    setInputValue(activeQuery);
    window.scrollTo(0, 0);
  }, [activeQuery]);

  const submitQuery = (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: trimmedQuery });
  };

  return (
    <div className="min-h-screen bg-organo-cream pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 rounded-[32px] border border-organo-green/10 bg-white/80 p-6 shadow-[0_20px_60px_rgba(16,44,35,0.08)] backdrop-blur-xl md:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-organo-pistachio/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-organo-green">
              <Sparkles size={14} />
              Site Search
            </div>
            <h1 className="font-serif text-4xl text-organo-green md:text-5xl">
              Find what you need faster
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-organo-gray md:text-lg">
              Search products, ingredients, delivery info, and AI tools across Organo.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitQuery(inputValue);
              }}
              className="mt-6"
            >
              <div className="flex flex-col gap-3 rounded-[28px] border border-organo-green/10 bg-organo-cream/70 p-3 shadow-inner md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-3 rounded-[20px] bg-white px-4 py-4">
                  <SearchIcon size={20} className="text-organo-gray/50" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Search juices, ingredients, delivery, AI tools..."
                    className="w-full bg-transparent text-base text-organo-gray placeholder-organo-gray/45 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-organo-green px-6 py-4 text-sm font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-organo-green/90"
                >
                  Search
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {!activeQuery && (
            <div className="space-y-6">
              <div className="rounded-[28px] border border-organo-green/10 bg-white p-6 shadow-[0_18px_50px_rgba(16,44,35,0.06)]">
                <h2 className="font-serif text-2xl text-organo-green">Popular searches</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {FEATURED_SEARCHES.map((query) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => submitQuery(query)}
                      className="rounded-full border border-organo-green/10 bg-organo-cream px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-organo-green transition-colors hover:bg-organo-pistachio/25"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Shop the Harvest",
                    description: "Browse bottles, produce, and bundles fresh from the field.",
                    to: "/shop",
                  },
                  {
                    title: "Check Delivery",
                    description: "See if your zip code is in a local or national zone.",
                    to: "/check-availability",
                  },
                  {
                    title: "Try AI Advisor",
                    description: "Get a quick recommendation based on your wellness goals.",
                    to: "/ai-advisor",
                  },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group rounded-[28px] border border-organo-green/10 bg-white p-6 shadow-[0_18px_50px_rgba(16,44,35,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(16,44,35,0.1)]"
                  >
                    <div className="text-xs font-bold uppercase tracking-[0.24em] text-organo-green/55">
                      Quick Jump
                    </div>
                    <h3 className="mt-3 font-serif text-2xl text-organo-green">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-organo-gray">{item.description}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-organo-green">
                      Open
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeQuery && (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-organo-green/55">
                    Search Results
                  </div>
                  <h2 className="mt-2 font-serif text-3xl text-organo-green">
                    {results.length} match{results.length === 1 ? "" : "es"} for "{activeQuery}"
                  </h2>
                </div>
                <div className="text-sm text-organo-gray">
                  Press enter from the header search any time to jump back here.
                </div>
              </div>

              {results.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      to={result.to}
                      className="group flex gap-4 rounded-[28px] border border-organo-green/10 bg-white p-4 shadow-[0_18px_50px_rgba(16,44,35,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(16,44,35,0.1)]"
                    >
                      {result.image ? (
                        <div className="h-28 w-24 shrink-0 overflow-hidden rounded-[22px] bg-organo-cream">
                          <img
                            src={result.image}
                            alt={result.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-organo-green to-organo-green/80 text-lg font-serif text-organo-pistachio">
                          {result.section.slice(0, 1)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-organo-green/8 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-organo-green">
                            {result.section}
                          </span>
                          {result.badge && (
                            <span className="rounded-full bg-organo-pistachio/20 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-organo-green">
                              {result.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-serif text-2xl text-organo-green">
                          {result.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-organo-gray">
                          {result.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-organo-green">
                            {result.priceLabel ?? "Open page"}
                          </span>
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-organo-green">
                            Explore
                            <ArrowRight
                              size={14}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-organo-green/20 bg-white/80 p-8 text-center shadow-[0_18px_50px_rgba(16,44,35,0.05)]">
                  <h3 className="font-serif text-3xl text-organo-green">No matches yet</h3>
                  <p className="mt-3 text-organo-gray">
                    Try a product name, ingredient, tag, or page like "mango", "delivery", or "AI
                    advisor".
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    {FEATURED_SEARCHES.map((query) => (
                      <button
                        key={query}
                        type="button"
                        onClick={() => submitQuery(query)}
                        className="rounded-full border border-organo-green/10 bg-organo-cream px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-organo-green transition-colors hover:bg-organo-pistachio/25"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
