import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "./Navbar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, toggleAuth } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isAuthenticated={isAuthenticated} onAuthToggle={toggleAuth} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
