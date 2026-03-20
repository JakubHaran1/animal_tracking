import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  logIn: () => void;
  logOut: () => void;
  toggleAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      logIn: () => setIsAuthenticated(true),
      logOut: () => setIsAuthenticated(false),
      toggleAuth: () => setIsAuthenticated((current) => !current),
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
