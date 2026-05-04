import { FormEvent, useState } from "react";

import type { CredentialsType, RegisterPayload } from "./../../types";
import { useAuth } from "../../context/AuthContext";

import { isAxiosError } from "axios";
import { getData } from "../../api/publicApi";
import { authService } from "../../services/authService";
import { getDataAuth } from "../../api/privateApi";

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

  const { logIn } = useAuth();
  const [loginData, setLoginData] = useState<CredentialsType>({
    username: undefined,
    password: undefined,
  });
  const [errors, setErrors] = useState<string | undefined>(undefined);
  const [registerData, setRegisterData] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [registerError, setRegisterError] = useState<string | undefined>(undefined);
  const [registerSuccess, setRegisterSuccess] = useState<string | undefined>(undefined);

  const handleInputChange = <K extends keyof CredentialsType>(
    name: K,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    const { value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterInputChange = <K extends keyof RegisterPayload>(
    name: K,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    const { value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event: React.SubmitEvent<HTMLElement>) => {
    event.preventDefault();
    setErrors(undefined);
    setRegisterSuccess(undefined);
    if (!loginData.username && !loginData.password) {
      setErrors("You have to pass username and password");
      return;
    }

    try {
      await authService.loginUser(loginData);
      const userResponse = await authService.getUser();
      logIn(userResponse);
      onLoginSuccess();
    } catch (err) {
      console.log(isAxiosError(err));
      if (isAxiosError(err)) {
        setErrors(err.response?.data.detail);
        return;
      }
      setErrors("Something goes wrong");
    }
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegisterError(undefined);
    setRegisterSuccess(undefined);

    const { username, email, password, confirm_password } = registerData;
    if (!username || !email || !password || !confirm_password) {
      setRegisterError("Uzupełnij wszystkie pola.");
      return;
    }

    if (password !== confirm_password) {
      setRegisterError("Hasła muszą być takie same.");
      return;
    }

    try {
      await authService.registerUser(registerData);
      setRegisterData({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setRegisterSuccess("Konto utworzone. Zaloguj się.");
      onSwitchToLogin();
    } catch (err) {
      if (isAxiosError(err)) {
        const data = err.response?.data;
        if (typeof data === "string") {
          setRegisterError(data);
          return;
        }
        if (data?.detail) {
          setRegisterError(data.detail);
          return;
        }
      }
      setRegisterError("Nie udało się utworzyć konta.");
    }
  };

  const handleSwitchToRegister = () => {
    setErrors(undefined);
    setRegisterError(undefined);
    setRegisterSuccess(undefined);
    onSwitchToRegister();
  };

  const handleSwitchToLogin = () => {
    setRegisterError(undefined);
    onSwitchToLogin();
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
            {registerSuccess ? (
              <p className="text-center text-sm text-green-800">
                {registerSuccess}
              </p>
            ) : null}
            {errors ? (
              <p className="text-center text-sm text-amber-700">{errors}</p>
            ) : null}
            <label htmlFor="Username" className="block text-sm text-green-900">
              Username
              <input
                id="Username"
                name="Username"
                type="Username"
                onChange={(e) => handleInputChange("username", e)}
                required
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <label htmlFor="password" className="block text-sm text-green-900">
              Hasło
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => handleInputChange("password", e)}
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
            <div className="test">
              <button
                /* To będzie oddzielnie w serwisie, teraz testowo tu */
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const observations = await getData("/observati=ons/");

                    console.log(observations);
                  } catch (err) {
                    if (!isAxiosError(err)) {
                      console.log(err);
                      return;
                    }
                    console.log(err.response?.status);
                    console.log(err.response?.statusText);
                  }
                }}
                type="submit"
                className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 hover:bg-green-600"
              >
                Data test
              </button>

              <button
                /* To będzie oddzielnie w serwisie, teraz testowo tu */
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const observations = await getDataAuth("/users/me/");
                    console.log(observations);
                  } catch (err) {
                    if (!isAxiosError(err)) {
                      console.log(err);
                      return;
                    }
                    console.log(err.response?.status);
                    console.log(err.response?.statusText);
                  }
                }}
                type="submit"
                className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 hover:bg-green-600"
              >
                auth data test
              </button>
            </div>
            <p className="text-sm text-green-800">
              nie masz konta?{" "}
              <button
                type="button"
                onClick={handleSwitchToRegister}
                className="font-semibold text-amber-700 underline underline-offset-2"
              >
                zarejestruj
              </button>
            </p>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegisterSubmit}>
            {registerError ? (
              <p className="text-center text-sm text-amber-700">{registerError}</p>
            ) : null}
            <label htmlFor="username" className="block text-sm text-green-900">
              Nazwa użytkownika
              <input
                id="username"
                name="username"
                type="text"
                value={registerData.username}
                onChange={(e) => handleRegisterInputChange("username", e)}
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <label htmlFor="email" className="block text-sm text-green-900">
              Email
              <input
                id="email"
                name="email"
                type="email"
                value={registerData.email}
                onChange={(e) => handleRegisterInputChange("email", e)}
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <label htmlFor="password" className="block text-sm text-green-900">
              Hasło
              <input
                id="password"
                name="password"
                type="password"
                value={registerData.password}
                onChange={(e) => handleRegisterInputChange("password", e)}
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-green-900"
            >
              Potwierdź hasło
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={registerData.confirm_password}
                onChange={(e) => handleRegisterInputChange("confirm_password", e)}
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-green-950 hover:bg-amber-300"
            >
              Załóż konto
            </button>

            <p className="text-sm text-green-800">
              masz już konto?{" "}
              <button
                type="button"
                onClick={handleSwitchToLogin}
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
