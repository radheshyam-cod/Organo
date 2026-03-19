import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { CartItem } from "../cart/CartContext";

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  estimatedDelivery: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], total: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("organo_orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("organo_orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      items,
      total,
      status: "Processing",
      estimatedDelivery: "Tomorrow, by 6 PM",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  return <OrderContext.Provider value={{ orders, addOrder }}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
