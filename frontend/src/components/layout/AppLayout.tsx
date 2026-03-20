import { ReactNode, useState } from "react";
import { AuthModal } from "../auth/AuthModal";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "./Navbar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, logIn, logOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");

  const handleOpenLogin = () => {
    setAuthView("login");
    setIsAuthModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLoginSuccess = () => {
    logIn();
    setIsAuthModalOpen(false);
    setAuthView("login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-100 via-lime-50 to-amber-50">
      <Navbar
        isAuthenticated={isAuthenticated}
        onLoginClick={handleOpenLogin}
        onLogoutClick={logOut}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
      <AuthModal
        isOpen={isAuthModalOpen}
        view={authView}
        onClose={handleCloseModal}
        onSwitchToRegister={() => setAuthView("register")}
        onSwitchToLogin={() => setAuthView("login")}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
