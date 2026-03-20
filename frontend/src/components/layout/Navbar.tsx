import { NavLink } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
  onAuthToggle: () => void;
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-green-700 text-lime-50" : "text-green-900 hover:bg-lime-200",
  ].join(" ");

const disabledNavLinkClassName =
  "cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-green-400 opacity-70";

export function Navbar({ isAuthenticated, onAuthToggle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-green-200 bg-lime-100/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-green-900">GeoApp</span>
        </div>

        <nav className="flex items-center gap-1">
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
            <NavLink to="/profile" className={navLinkClassName}>
              Mój profil
            </NavLink>
          ) : (
            <span className={disabledNavLinkClassName}>Mój profil</span>
          )}
        </nav>

        <button
          type="button"
          onClick={onAuthToggle}
          className="rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-green-950 transition hover:bg-amber-300"
        >
          {isAuthenticated ? "Wyloguj" : "Logowanie / Rejestracja"}
        </button>
      </div>
    </header>
  );
}
