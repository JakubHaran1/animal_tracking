import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import type { User } from "../types";

interface AuthContextValue {
  isAuthenticated: boolean; // to bym wywalił i sprawdzał po user undefinded
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
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
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
