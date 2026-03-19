import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Subscription {
  id: string;
  productName: string;
  frequency: string;
  status: "Active" | "Paused" | "Cancelled";
  price: number;
  nextDelivery: string;
  image?: string;
  description?: string;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, "id" | "status">) => void;
  pauseSubscription: (id: string) => void;
  resumeSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  skipSubscription: (id: string) => void;
  swapSubscription: (id: string, newProductName: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("organo_subscriptions");
    if (stored) setSubscriptions(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("organo_subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = (sub: Omit<Subscription, "id" | "status">) => {
    const newSub: Subscription = {
      ...sub,
      id: crypto.randomUUID(),
      status: "Active",
    };
    setSubscriptions((prev) => [newSub, ...prev]);
  };

  const updateStatus = (id: string, status: Subscription["status"]) => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status } : sub)));
  };

  const pauseSubscription = (id: string) => updateStatus(id, "Paused");
  const resumeSubscription = (id: string) => updateStatus(id, "Active");
  const cancelSubscription = (id: string) => updateStatus(id, "Cancelled");
  
  const skipSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id !== id) return sub;
      const current = new Date(sub.nextDelivery);
      current.setDate(current.getDate() + 7); // just add 7 days for a skip
      return { ...sub, nextDelivery: current.toISOString().split('T')[0] };
    }));
  };

  const swapSubscription = (id: string, newProductName: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id !== id) return sub;
      return { ...sub, productName: newProductName };
    }));
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
        skipSubscription,
        swapSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
