import { useEffect, useRef, useState } from "react";
import { useObservationContext } from "../../context/ObservationContext";
import ImageCropper from "../form/ImageCroppper";

import { type ObservationDraft, type ImageCropperHandle } from "../../types";
import { observationsService } from "../../services";
import { isAxiosError } from "axios";

const initialFormState: ObservationDraft = {
  title: "",
  description: "",
};

interface ErrorStateType {
  title: string[];
  description: string[];
  other: string;
}

interface Species {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
}

export function AddObservationModal({
  setObservationSaved,
}: {
  setObservationSaved: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [form, setForm] = useState<ObservationDraft>(initialFormState);

  const [errors, setErrors] = useState<ErrorStateType>({
    title: [],
    description: [],
    other: "",
  });

  const [speciesQuery, setSpeciesQuery] = useState("");
  const [speciesResults, setSpeciesResults] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [isSearchingSpecies, setIsSearchingSpecies] = useState(false);

  const { isAddObservationOpen, onCloseModal, activeObservationCoords } =
    useObservationContext();

  const CropRef = useRef<ImageCropperHandle>(null);

  useEffect(() => {
    if (speciesQuery.trim().length < 2) {
      setSpeciesResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearchingSpecies(true);

        const response = await fetch(
          `http://localhost:8000/api/species/?search=${encodeURIComponent(
            speciesQuery,
          )}`,
        );

        const data = await response.json();

        setSpeciesResults(Array.isArray(data) ? data : data.results ?? []);
      } catch (error) {
        console.error("Błąd wyszukiwania gatunków:", error);
      } finally {
        setIsSearchingSpecies(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [speciesQuery]);

  if (!isAddObservationOpen) {
    return null;
  }

  const handleChangeInputValue = <K extends keyof ObservationDraft>(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: K,
  ) => {
    const val = e.target.value;

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleAddSpecies = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/species/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: speciesQuery,
          latitude: 0,
          longitude: 0,
        }),
      });

      const newSpecies = await response.json();

      setSelectedSpecies(newSpecies);
      setSpeciesQuery(newSpecies.name);
      setSpeciesResults([]);
    } catch (error) {
      console.error("Błąd dodawania gatunku:", error);
    }
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const img = await CropRef.current?.getCroppedData();

    if (
      !img ||
      !selectedSpecies ||
      !activeObservationCoords?.latitude ||
      !activeObservationCoords?.longitude
    ) {
      setErrors((prev) => ({
        ...prev,
        other:
          "Dodaj zdjęcie, wybierz gatunek i upewnij się, że wybrano lokalizację.",
      }));

      return;
    }

    const latitude = activeObservationCoords.latitude;
    const longitude = activeObservationCoords.longitude;

    try {
      await observationsService.createObservation({
        ...form,
        latitude,
        longitude,
        img,
        speciesId: selectedSpecies.id,
      });

      setForm(initialFormState);
      setSpeciesQuery("");
      setSpeciesResults([]);
      setSelectedSpecies(null);

      setObservationSaved(true);

      onCloseModal();
    } catch (err) {
      if (isAxiosError(err)) {
        setErrors((rest) => ({
          ...rest,
          ...err.response?.data,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          other: "Something goes wrong",
        }));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/40 px-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-scroll rounded-2xl border border-green-200 bg-lime-50 p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-green-900">
            Dodaj obserwację
          </h2>

          <button
            type="button"
            onClick={() => {
              onCloseModal();

              setForm(initialFormState);
              setSpeciesQuery("");
              setSpeciesResults([]);
              setSelectedSpecies(null);
            }}
            className="rounded-md px-2 py-1 text-sm font-medium text-green-700 hover:bg-lime-200"
          >
            Zamknij
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-red-600">{errors.other}</p>

          <label htmlFor="title" className="block text-sm text-green-900">
            Tytuł

            <input
              id="title"
              type="text"
              value={form.title}
              required
              onChange={(event) =>
                handleChangeInputValue(event, "title")
              }
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />

            {errors.title &&
              errors.title.map((element) => (
                <p key={element} className="text-red-600">
                  {element}
                </p>
              ))}
          </label>

          <label
            htmlFor="description"
            className="block text-sm text-green-900"
          >
            Opis

            <textarea
              id="description"
              value={form.description}
              required
              onChange={(event) => {
                handleChangeInputValue(event, "description");
              }}
              rows={4}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />

            {errors.description &&
              errors.description.map((element) => (
                <p key={element} className="text-red-600">
                  {element}
                </p>
              ))}
          </label>

          <div className="space-y-2">
            <label className="block text-sm text-green-900">
              Gatunek

              <input
                type="text"
                value={speciesQuery}
                onChange={(e) => {
                  setSpeciesQuery(e.target.value);
                  setSelectedSpecies(null);
                }}
                placeholder="Wpisz gatunek, np. kot"
                className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
              />
            </label>

            {isSearchingSpecies && (
              <p className="text-sm text-green-700">Szukam...</p>
            )}

            <div className="flex flex-col gap-2">
              {speciesResults.map((species) => (
                <button
                  key={species.id}
                  type="button"
                  onClick={() => {
                    setSelectedSpecies(species);
                    setSpeciesQuery(species.name);
                    setSpeciesResults([]);
                  }}
                  className="rounded-md border border-lime-300 bg-lime-100 px-3 py-2 text-left text-green-900 hover:bg-lime-200"
                >
                  {species.name}
                </button>
              ))}
            </div>

            {speciesQuery.length >= 2 &&
              speciesResults.length === 0 &&
              !selectedSpecies &&
              !isSearchingSpecies && (
                <button
                  type="button"
                  onClick={handleAddSpecies}
                  className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600"
                >
                  Dodaj gatunek "{speciesQuery}"
                </button>
              )}

            {selectedSpecies && (
              <p className="text-sm text-green-700">
                Wybrany gatunek: {selectedSpecies.name}
              </p>
            )}
          </div>

          <ImageCropper
            MIN_WIDTH={300}
            MIN_HEIGHT={150}
            aspectRatioWidth={2}
            aspectRatioHeight={1}
            maxContainerHeight="30vh"
            ref={CropRef}
          />

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