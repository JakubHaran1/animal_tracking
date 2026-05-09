import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import type { User } from "../types";
import { authService } from "../services/authService";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | undefined;
  logIn: (userData: User) => void;
  logOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login on refresh
  useEffect(() => {
    async function init() {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) return;
      try {
        const user = await authService.getUser();
        setUser(user);
        setIsAuthenticated(true);
      } catch {
        console.log("nie mozna zalogowac usera");
      }
    }
    init();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user: user,
      logIn: (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
      },
      logOut: () => {
        setUser(undefined);
        localStorage.clear();
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
