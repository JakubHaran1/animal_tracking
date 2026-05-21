import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { authService } from "../services/authService";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Weryfikuję adres e-mail...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Brak tokenu w linku weryfikacyjnym.");
      return;
    }

    let isActive = true;

    authService
      .verifyEmail(token)
      .then((response) => {
        if (!isActive) {
          return;
        }
        setStatus("success");
        setMessage(response.detail);
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        if (isAxiosError(error)) {
          const data = error.response?.data;
          const apiMessage =
            typeof data?.detail === "string"
              ? data.detail
              : typeof data?.token === "string"
                ? data.token
                : undefined;

          setMessage(apiMessage ?? "Nie udało się zweryfikować adresu e-mail.");
        } else {
          setMessage("Nie udało się zweryfikować adresu e-mail.");
        }
        setStatus("error");
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold text-green-950">Weryfikacja e-mail</h1>
      <p className={status === "error" ? "text-amber-700" : "text-green-800"}>
        {message}
      </p>
      {status !== "loading" ? (
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 transition hover:bg-green-600"
        >
          Wróć na stronę główną
        </button>
      ) : null}
    </section>
  );
}
