import { memo } from "react";
import { Plus, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../hooks/useProducts";
import { formatCurrency, getProductImage } from "../lib/utils";

type Variant = "grid" | "carousel" | "compact";

interface ProductCardProps {
  product: Product;
  onAdd: (id: string) => void;
  variant?: Variant;
  showRating?: boolean;
}

const variantClasses: Record<Variant, string> = {
  grid: "group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300",
  carousel:
    "group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300",
  compact:
    "group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300",
};

function ProductCardComponent({
  product,
  onAdd,
  variant = "grid",
  showRating = true,
}: ProductCardProps) {
  const imageSrc = getProductImage(product);

  return (
    <div className={variantClasses[variant]}>
      <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/placeholder.png";
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 mix-blend-overlay z-10" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-organo-green uppercase tracking-wider pointer-events-none">
          {product.tag || product.category || "Fresh"}
        </div>
        <div className="absolute inset-0 bg-organo-green/85 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center pointer-events-none backdrop-blur-sm">
          {product.description && (
             <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{product.description}</p>
             </div>
          )}
          {product.benefits && product.benefits.length > 0 && (
             <div className="mb-6 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Benefits</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {product.benefits.slice(0, 3).map((b) => (
                    <span key={b} className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
             </div>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAdd(product.id.toString());
            }}
            className="btn-premium bg-white text-organo-green px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-150 flex items-center gap-2 pointer-events-auto"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={16} className="relative z-10" /> <span className="relative z-10">Add to Cart</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link
            to={`/product/${product.id}`}
            className="hover:text-organo-pistachio transition-colors"
          >
            <h3 className="font-serif text-xl text-organo-green font-bold">{product.name}</h3>
          </Link>
          {showRating && (
            <div className="flex items-center text-organo-gold" aria-label="Rating">
              <Star size={14} fill="currentColor" aria-hidden />
              <span className="text-xs font-bold text-gray-400 ml-1">All</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">{product.measurement || "500ml"}</span>
          <span className="font-sans font-bold text-lg text-organo-green">
            {formatCurrency(Number(product.price))}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CompactProductCard({ product, onAdd }: ProductCardProps) {
  const imageSrc = getProductImage(product);
  return (
    <div className="flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
      <img
        src={imageSrc}
        alt={product.name}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/images/placeholder.png";
        }}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <p className="font-bold text-organo-green">{product.name}</p>
        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold">{formatCurrency(Number(product.price))}</span>
          <button
            type="button"
            onClick={() => onAdd(product.id.toString())}
            className="flex items-center gap-1 text-organo-green font-bold text-xs"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCardComponent.displayName = "ProductCard";

export const ProductCard = memo(ProductCardComponent);
