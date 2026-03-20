import { NavLink } from "react-router-dom";

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
  return (
    <header className="sticky top-0 z-20 border-b border-green-200 bg-lime-100/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 xl:px-6 2xl:max-w-[1800px] 2xl:px-8 2xl:py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-green-900 2xl:text-2xl">Animal Tracking</span>
        </div>

        <nav className="flex items-center gap-1 2xl:gap-2">
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
          onClick={isAuthenticated ? onLogoutClick : onLoginClick}
          className="rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-green-950 transition hover:bg-amber-300 2xl:px-5 2xl:py-2.5 2xl:text-base"
        >
          {isAuthenticated ? "Wyloguj" : "Zaloguj"}
        </button>
      </div>
    </header>
  );
}
