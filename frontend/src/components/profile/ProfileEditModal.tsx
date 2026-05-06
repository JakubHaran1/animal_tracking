import { FormEvent, useEffect, useState } from "react";

interface ProfileEditModalProps {
  isOpen: boolean;
  initialCity: string;
  isSaving: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (city: string) => void;
}

export function ProfileEditModal({
  isOpen,
  initialCity,
  isSaving,
  error,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  const [city, setCity] = useState(initialCity);

  useEffect(() => {
    if (isOpen) {
      setCity(initialCity);
    }
  }, [initialCity, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(city.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-green-200 bg-lime-50 p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-green-900">Edytuj profil</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm font-medium text-green-700 hover:bg-lime-200"
          >
            Zamknij
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="text-center text-sm text-amber-700">{error}</p>
          ) : null}
          <label htmlFor="city" className="block text-sm text-green-900">
            Miasto
            <input
              id="city"
              name="city"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-green-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Zapisywanie..." : "Zapisz"}
          </button>
        </form>
      </div>
    </div>
  );
}
