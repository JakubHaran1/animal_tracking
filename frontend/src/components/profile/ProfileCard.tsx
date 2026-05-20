import { useMemo, useRef, useState } from "react";
<<<<<<< HEAD
import { User, Observation } from "../../types";
import ObservationsList from "../observations/ObservationsList";
import { createPortal } from "react-dom";
import EditObservationModal from "../observations/EditObservationModal";
=======
import { User } from "../../types";
import { observationsService } from "../../services";

>>>>>>> improvements2
interface ProfileCardProps {
  user: User;
  title?: string;
  onEdit?: () => void;
  onChangePassword?: () => void;
  enableObservationFilters?: boolean;
  observationSaved: number;
  setObservationSaved: React.Dispatch<React.SetStateAction<number>>;
}

type ProfileObservationFilters = {
  title: string;
  date: string;
  species: string;
};

type ProfileObservationChecked = {
  title: boolean;
  date: boolean;
  species: boolean;
};

export function ProfileCard({
  user,
  title = "Mój profil",
  onEdit,
  onChangePassword,
  enableObservationFilters = false,
  setObservationSaved,
}: ProfileCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [openObservation, setOpenObservation] = useState<Observation | null>(
    null,
  );
  const [publications, setPublications] = useState(user.publications);

  const [searchFilter, setSearchFilter] = useState<ProfileObservationFilters>({
    title: "",
    date: "",
    species: "",
  });

  const [checked, setChecked] = useState<ProfileObservationChecked>({
    title: true,
    date: false,
    species: false,
  });

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.id as keyof ProfileObservationFilters;

    if (checked[name]) {
      setChecked((res) => ({ ...res, [name]: false }));
      setSearchFilter((res) => ({ ...res, [name]: "" }));
    } else {
      setChecked((res) => ({ ...res, [name]: true }));
    }
  };

  const generatePlaceholder = useMemo(() => {
    const labels = {
      title: "tytule",
      date: "dacie",
      species: "gatunku",
    };

    const activeFilters = Object.entries(checked)
      .filter(([_, value]) => value)
      .map(([key]) => labels[key as keyof ProfileObservationFilters]);

    if (activeFilters.length === 0) return "Szukaj";
    return `Szukaj po ${activeFilters.join(", ")}`;
  }, [checked]);

  const handleFilter = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = inputRef.current?.value?.trim() ?? "";

    if (!query) {
      setSearchFilter({ title: "", date: "", species: "" });
      return;
    }

    const values = query.split(",").map((value) => value.trim());

    const filters: ProfileObservationFilters = {
      title: "",
      date: "",
      species: "",
    };

    let valueIndex = 0;

    Object.entries(checked).forEach(([key, isChecked]) => {
      if (isChecked) {
        filters[key as keyof ProfileObservationFilters] =
          values[valueIndex] || "";
        valueIndex++;
      }
    });

    setSearchFilter(filters);
  };

  const handleDeleteObservation = async (id: string | number) => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz usunąć obserwację?",
    );

    if (!confirmed) return;

    try {
      await observationsService.deleteObservation(id);

      setPublications((prev) =>
        prev.filter((publication) => publication.id !== id),
      );
    } catch (error) {
      console.error("Błąd usuwania obserwacji:", error);
      alert("Nie udało się usunąć obserwacji.");
    }
  };

  const filteredPublications = useMemo(() => {
    if (!enableObservationFilters) {
      return publications;
    }

    const normalized = (value: string) => value.trim().toLowerCase();

    const titleQuery = normalized(searchFilter.title);
    const dateQuery = normalized(searchFilter.date);
    const speciesQuery = normalized(searchFilter.species);

    return publications.filter((publication) => {
      if (titleQuery && !publication.title.toLowerCase().includes(titleQuery)) {
        return false;
      }
      if (
        dateQuery &&
        !publication.createdAt.toLowerCase().includes(dateQuery)
      ) {
        return false;
      }

      if (
        speciesQuery &&
        !publication.speciesName.toLowerCase().includes(speciesQuery)
      ) {
        return false;
      }

      return true;
    });
  }, [enableObservationFilters, searchFilter, publications]);

  return (
    <section className="rounded-xl border border-green-200 bg-lime-50 p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h1 className="text-xl font-semibold text-green-900">{title}</h1>
        {onEdit || onChangePassword ? (
          <div className="flex flex-wrap items-center gap-2">
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold text-green-950 transition hover:bg-amber-300"
              >
                Edytuj
              </button>
            ) : null}
            {onChangePassword ? (
              <button
                type="button"
                onClick={onChangePassword}
                className="rounded-md border border-green-700 px-3 py-1.5 text-sm font-semibold text-green-900 transition hover:bg-lime-100"
              >
                Zmień hasło
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-green-800">Nazwa użytkownika</dt>
          <dd className="text-green-950">{user.username}</dd>
        </div>

        <div>
          <dt className="font-medium text-green-800">Email</dt>
          <dd className="text-green-950">{user.email}</dd>
        </div>

        <div>
          <dt className="font-medium text-green-800">Miasto</dt>
          <dd className="text-green-950">{user.city || "Nie podano"}</dd>
        </div>

        <div>
          <dt className="font-medium text-green-800">Dołączono</dt>
          <dd className="text-green-950">{user.joinedAt}</dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-green-200 pt-4">
        <h2 className="mb-3 text-base font-semibold text-green-900">
          Dodane publikacje
        </h2>
    

        {enableObservationFilters && publications.length > 0 ? (
          <>
            <div className="flex flex-col items-start gap-4 md:flex-row">
              <h3>Wyszukuj po:</h3>

              <div className="flex items-center gap-2">
                <label htmlFor="title">Tytule obserwacji</label>
                <input
                  onChange={handleChangeFilter}
                  checked={checked.title}
                  id="title"
                  value="title"
                  type="checkbox"
                />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="date">Dacie</label>
                <input
                  onChange={handleChangeFilter}
                  checked={checked.date}
                  id="date"
                  value="date"
                  type="checkbox"
                />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="species">Gatunku</label>
                <input
                  onChange={handleChangeFilter}
                  checked={checked.species}
                  id="species"
                  value="species"
                  type="checkbox"
                />
              </div>
            </div>

            <form
              onSubmit={handleFilter}
              className="mt-3 rounded-xl border border-green-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="search"
                  ref={inputRef}
                  placeholder={generatePlaceholder}
                  className="w-full rounded-md border border-green-200 px-3 py-2 text-sm text-green-900 outline-none focus:border-green-600"
                />

                <button
                  type="submit"
                  className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 transition hover:bg-green-600"
                >
                  Szukaj
                </button>
              </div>
            </form>

            <p className="mt-2 text-xs text-green-800">
              Znaleziono {filteredPublications.length} obserwacji
            </p>
          </>
        ) : null}

        {publications.length === 0 ? (
          <p className="text-sm text-green-800">Brak publikacji.</p>
        ) : (
          <>
            <ObservationsList
              openObservation={openObservation}
              setOpenObservation={setOpenObservation}
              observations={user.publications}
              _listType="edit"
            />
            {openObservation &&
              createPortal(
                <EditObservationModal
                  openObservation={openObservation}
                  setOpenObservation={setOpenObservation}
                  setObservationSaved={setObservationSaved}
                />,
                document.body,
              )}
          </>
          <ul className="space-y-2">
            {filteredPublications.map((publication) => (
              <li
                key={publication.id}
                className="flex items-center justify-between gap-4 rounded-md border border-green-200 bg-white/70 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-green-950">
                    {publication.title}
                  </p>

                  <p className="text-green-800">
                    Data: {publication.createdAt}
                  </p>

                  {publication.speciesName ? (
                    <p className="text-green-800">
                      Gatunek: {publication.speciesName}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteObservation(publication.id)}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Usuń
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}