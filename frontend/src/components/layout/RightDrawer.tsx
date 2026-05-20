import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

interface RightDrawerProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const mobileNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "block w-full rounded-md px-4 py-3 text-base font-semibold transition",
    isActive ? "bg-green-700 text-lime-50" : "text-green-950 hover:bg-lime-200",
  ].join(" ");

const mobileDisabledNavLinkClassName =
  "block w-full cursor-not-allowed rounded-md px-4 py-3 text-base font-semibold text-green-500/80 opacity-70";

export function RightDrawer({
  isOpen,
  isAuthenticated,
  onClose,
  onLoginClick,
  onLogoutClick,
}: RightDrawerProps) {
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      firstLinkRef.current?.focus();
    }
  }, [isOpen]);

  const handleAuthClick = () => {
    onClose();
    if (isAuthenticated) {
      onLogoutClick();
      return;
    }
    onLoginClick();
  };

  return (
    <div
      className={`fixed inset-0 z-30 md:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-6 bg-lime-50 px-5 pb-6 pt-6 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-green-900">Menu</span>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/"
            className={mobileNavLinkClassName}
            end
            onClick={onClose}
            ref={firstLinkRef}
          >
            Mapa
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/friends" className={mobileNavLinkClassName} onClick={onClose}>
              Znajomi
            </NavLink>
          ) : (
            <span className={mobileDisabledNavLinkClassName}>Znajomi</span>
          )}
          {isAuthenticated ? (
            <NavLink
              to="/friends/add"
              className={mobileNavLinkClassName}
              onClick={onClose}
            >
              Dodaj znajomego
            </NavLink>
          ) : (
            <span className={mobileDisabledNavLinkClassName}>Dodaj znajomego</span>
          )}
          {isAuthenticated ? (
            <NavLink to="/profile" className={mobileNavLinkClassName} onClick={onClose}>
              Mój profil
            </NavLink>
          ) : (
            <span className={mobileDisabledNavLinkClassName}>Mój profil</span>
          )}
        </nav>
        <button
          type="button"
          onClick={handleAuthClick}
          className="mt-auto w-full rounded-md bg-amber-400 px-4 py-3 text-base font-semibold text-green-950 transition hover:bg-amber-300"
        >
          {isAuthenticated ? "Wyloguj" : "Zaloguj"}
        </button>
      </aside>
    </div>
  );
}
