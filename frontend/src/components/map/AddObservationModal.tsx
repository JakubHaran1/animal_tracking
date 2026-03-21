import { FormEvent, useState } from "react";

export interface ObservationDraft {
  title: string;
  description: string;
  location: string;
  imageName: string;
}

interface AddObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (draft: ObservationDraft) => void;
}

const initialFormState: ObservationDraft = {
  title: "",
  description: "",
  location: "",
  imageName: "",
};

export function AddObservationModal({ isOpen, onClose, onSubmit }: AddObservationModalProps) {
  const [form, setForm] = useState<ObservationDraft>(initialFormState);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
    setForm(initialFormState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/40 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-green-200 bg-lime-50 p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-green-900">Dodaj obserwację</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm font-medium text-green-700 hover:bg-lime-200"
          >
            Zamknij
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-green-900">
            Tytuł
            <input
              type="text"
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />
          </label>

          <label className="block text-sm text-green-900">
            Opis
            <textarea
              required
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              rows={4}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />
          </label>

          <label className="block text-sm text-green-900">
            Lokalizacja
            <input
              type="text"
              required
              placeholder="np. Kraków, Las Wolski"
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />
          </label>

          <label className="block text-sm text-green-900">
            Zdjęcie
            <input
              type="file"
              accept="image/*"
              required
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  imageName: event.target.files?.[0]?.name ?? "",
                }))
              }
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 file:mr-3 file:rounded-md file:border-0 file:bg-amber-300 file:px-3 file:py-1 file:font-medium file:text-green-950 hover:file:bg-amber-200"
            />
          </label>

          <p className="text-xs text-green-700">
            Placeholder: formularz jest gotowy pod przyszłe wysyłanie danych do backendu.
          </p>

          <button
            type="submit"
            className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 transition hover:bg-green-600"
          >
            Zapisz obserwację
          </button>
        </form>
      </div>
    </div>
  );
}
