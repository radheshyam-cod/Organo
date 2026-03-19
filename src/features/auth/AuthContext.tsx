import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { authService } from "../../services/authService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("organo_token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const boot = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await authService.me(token);
        setUser(res.user);
      } catch (err: any) {
        setError(err.message ?? "Session expired");
        setToken(null);
        localStorage.removeItem("organo_token");
      } finally {
        setLoading(false);
      }
    };
    void boot();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem("organo_token", res.token);
      return true;
    } catch (err: any) {
      setError(err.message ?? "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.signup(name, email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem("organo_token", res.token);
      return true;
    } catch (err: any) {
      setError(err.message ?? "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("organo_token");
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
    }),
    [user, token, loading, error, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
