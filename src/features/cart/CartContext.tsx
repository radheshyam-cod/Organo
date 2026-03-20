import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { cartService } from "../../services/cartService";
import { useAuth } from "../auth/AuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  measurement?: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  addToCart: (product: string | { id: string | number }) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setItems([]);
        return;
      }
      try {
        setLoading(true);
        const res = await cartService.get(token);
        if (res && "cart" in res && res.cart && res.cart.items) {
          const mapped = res.cart.items.map((item: any) => ({
            id: item.productId,
            name: item.product?.name ?? "Product",
            price: Number(item.price),
            quantity: item.quantity,
            image: item.product?.image,
            measurement: item.product?.measurement,
          }));
          setItems(mapped);
        } else {
          setItems([]);
        }
      } catch (err: any) {
        setError(err.message ?? "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    void fetchCart();
  }, [token]);

  const refreshCart = useCallback(async () => {
    if (!token) return;
    const res = await cartService.get(token);
    if (res && "cart" in res && res.cart && res.cart.items) {
      const mapped = res.cart.items.map((item: any) => ({
        id: item.productId,
        name: item.product?.name ?? "Product",
        price: Number(item.price),
        quantity: item.quantity,
        image: item.product?.image,
        measurement: item.product?.measurement,
      }));
      setItems(mapped);
    } else {
      setItems([]);
    }
  }, [token]);

  const addToCart = useCallback(
    async (product: string | { id: string | number }) => {
      if (!token) {
        navigate("/account");
        setIsOpen(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const productId = typeof product === "string" ? product : product.id.toString();
        await cartService.add(token, productId, 1);
        await refreshCart();
        setIsOpen(true);
      } catch (err: any) {
        setError(err.message ?? "Failed to add to cart");
      } finally {
        setLoading(false);
      }
    },
    [token, refreshCart, navigate]
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        await cartService.remove(token, id);
        await refreshCart();
      } catch (err: any) {
        setError(err.message ?? "Failed to remove item");
      } finally {
        setLoading(false);
      }
    },
    [token, refreshCart]
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        await cartService.update(token, id, quantity);
        await refreshCart();
      } catch (err: any) {
        setError(err.message ?? "Failed to update quantity");
      } finally {
        setLoading(false);
      }
    },
    [token, refreshCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );
  const cartCount = useMemo(() => items.reduce((count, item) => count + item.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      cartTotal,
      cartCount,
    }),
    [
      items,
      isOpen,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      cartTotal,
      cartCount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
