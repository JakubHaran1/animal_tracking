import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RightDrawer } from "./RightDrawer";

interface NavbarProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition 2xl:px-4 2xl:py-2.5 2xl:text-base",
    isActive ? "bg-green-700 text-lime-50" : "text-green-900 hover:bg-lime-200",
  ].join(" ");

const disabledNavLinkClassName =
  "cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-green-400 opacity-70 2xl:px-4 2xl:py-2.5 2xl:text-base";

export function Navbar({
  isAuthenticated,
  onLoginClick,
  onLogoutClick,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-green-200 bg-lime-100/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 xl:px-6 2xl:max-w-[1800px] 2xl:px-8 2xl:py-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-green-900 2xl:text-2xl">
              Animal Tracking
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex 2xl:gap-2">
            <NavLink to="/" className={navLinkClassName} end>
              Mapa
            </NavLink>
            {isAuthenticated ? (
              <NavLink to="/friends" className={navLinkClassName}>
                Znajomi
              </NavLink>
            ) : (
              <span className={disabledNavLinkClassName}>Znajomi</span>
            )}
            {isAuthenticated ? (
              <NavLink to="/friends/add" className={navLinkClassName}>
                Dodaj znajomego
              </NavLink>
            ) : (
              <span className={disabledNavLinkClassName}>Dodaj znajomego</span>
            )}
            {isAuthenticated ? (
              <NavLink to="/profile" className={navLinkClassName}>
                Mój profil
              </NavLink>
            ) : (
              <span className={disabledNavLinkClassName}>Mój profil</span>
            )}
          </nav>

          <button
            type="button"
            onClick={isAuthenticated ? onLogoutClick : onLoginClick}
            className="hidden rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-green-950 transition hover:bg-amber-300 md:inline-flex 2xl:px-5 2xl:py-2.5 2xl:text-base"
          >
            {isAuthenticated ? "Wyloguj" : "Zaloguj"}
          </button>

          <button
            type="button"
            onClick={handleToggleMenu}
            aria-controls="mobile-drawer"
            aria-expanded={isMenuOpen}
            className="inline-flex items-center justify-center rounded-md border border-green-200 bg-lime-50 p-2 text-green-900 transition hover:bg-lime-200 md:hidden"
          >
            <span className="sr-only">Menu</span>
            {isMenuOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="M6 6 18 18" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </header>
      <RightDrawer
        isOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        onClose={handleCloseMenu}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogoutClick}
      />
    </>
  );
}
