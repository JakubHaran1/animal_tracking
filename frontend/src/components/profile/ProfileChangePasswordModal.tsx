import { FormEvent, useEffect, useState } from "react";

interface ProfileChangePasswordModalProps {
  isOpen: boolean;
  isSaving: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) => void;
}

export function ProfileChangePasswordModal({
  isOpen,
  isSaving,
  error,
  onClose,
  onSave,
}: ProfileChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setFormError(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setFormError("Uzupełnij wszystkie pola.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setFormError("Hasła muszą być takie same.");
      return;
    }

    onSave(currentPassword, newPassword, confirmNewPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-green-200 bg-lime-50 p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-green-900">Zmień hasło</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm font-medium text-green-700 hover:bg-lime-200"
          >
            Zamknij
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {formError ? (
            <p className="text-center text-sm text-amber-700">{formError}</p>
          ) : null}
          {!formError && error ? (
            <p className="text-center text-sm text-amber-700">{error}</p>
          ) : null}
          <label
            htmlFor="current-password"
            className="block text-sm text-green-900"
          >
            Aktualne hasło
            <input
              id="current-password"
              name="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />
          </label>
          <label htmlFor="new-password" className="block text-sm text-green-900">
            Nowe hasło
            <input
              id="new-password"
              name="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />
          </label>
          <label
            htmlFor="confirm-new-password"
            className="block text-sm text-green-900"
          >
            Powtórz nowe hasło
            <input
              id="confirm-new-password"
              name="confirm-new-password"
              type="password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-green-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Zmienianie..." : "Zmień hasło"}
          </button>
        </form>
      </div>
    </div>
  );
}
