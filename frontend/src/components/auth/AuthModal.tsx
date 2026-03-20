import { FormEvent } from "react";

type AuthModalView = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  view: AuthModalView;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToLogin: () => void;
  onLoginSuccess: () => void;
}

export function AuthModal({
  isOpen,
  view,
  onClose,
  onSwitchToRegister,
  onSwitchToLogin,
  onLoginSuccess,
}: AuthModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLoginSuccess();
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-green-200 bg-lime-50 p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-green-900">
            {view === "login" ? "Logowanie" : "Rejestracja"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm font-medium text-green-700 hover:bg-lime-200"
          >
            Zamknij
          </button>
        </div>

        {view === "login" ? (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <label className="block text-sm text-green-900">
              Email
              <input
                type="email"
                required
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <label className="block text-sm text-green-900">
              Hasło
              <input
                type="password"
                required
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 hover:bg-green-600"
            >
              Zaloguj
            </button>
            <p className="text-sm text-green-800">
              nie masz konta?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-semibold text-amber-700 underline underline-offset-2"
              >
                zarejestruj
              </button>
            </p>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegisterSubmit}>
            <label className="block text-sm text-green-900">
              Nazwa użytkownika
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <label className="block text-sm text-green-900">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <label className="block text-sm text-green-900">
              Hasło
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-green-950 hover:bg-amber-300"
            >
              Załóż konto (wkrótce)
            </button>
            <p className="text-sm text-green-800">
              masz już konto?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-green-700 underline underline-offset-2"
              >
                zaloguj
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
