import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  image?: string;
  price?: number;
  description?: string;
  measurement?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("organo_wishlist");
    if (storedWishlist) {
      setItems(JSON.parse(storedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("organo_wishlist", JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => items.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
