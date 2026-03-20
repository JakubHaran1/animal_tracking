import { NavLink } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
  onAuthToggle: () => void;
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200",
  ].join(" ");

export function Navbar({ isAuthenticated, onAuthToggle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-slate-900">GeoApp</span>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink to="/" className={navLinkClassName} end>
            Mapa
          </NavLink>
          <NavLink to="/friends" className={navLinkClassName}>
            Znajomi
          </NavLink>
          <NavLink to="/profile" className={navLinkClassName}>
            Mój profil
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={onAuthToggle}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          {isAuthenticated ? "Wyloguj" : "Logowanie / Rejestracja"}
        </button>
      </div>
    </header>
  );
}
