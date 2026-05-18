import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  BoundsType,
  CheckedFilterTypes,
  Observation,
  ObservationFilterTypes,
} from "../../types";

import MapWrapper from "./MapWrapper";
import ObservationsList from "../observations/ObservationsList";
import ObservationSearch from "../observations/ObservationSearch";
import { useAuth } from "../../context/AuthContext";
import { useObservationContext } from "../../context/ObservationContext";
import GetObservationModal from "../observations/GetObservationModal";
import { observationsService } from "../../services";

export function MapPlaceholder({
  observationSaved,
}: {
  observationSaved: boolean;
}) {
  const { onOpenModal } = useObservationContext();
  const { isAuthenticated } = useAuth();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [bounds, setBounds] = useState<BoundsType | null>(null);
  const [openObservation, setOpenObservation] = useState<Observation | null>(
    null,
  );

  const [isOpenObsModal, setIsOpenObsModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState<ObservationFilterTypes>({
    title: "",
    author: "",
    species: "",
  });
  const [checked, setChecked] = useState<CheckedFilterTypes>({
    title: true,
    author: false,
    species: false,
  });

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.id as keyof ObservationFilterTypes;

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
      author: "autorze",
      species: "gatunku",
    };

    const activeFilters = Object.entries(checked)
      .filter(([_, value]) => value)
      .map(([k]) => labels[k as keyof ObservationFilterTypes]);

    if (activeFilters.length == 0) return `Szukaj`;
    return `Szukaj po ${activeFilters.join(",")}`;
  }, [checked]);

  const handleFilter = (
    e: React.SubmitEvent<HTMLFormElement>,
    query: string | undefined,
  ) => {
    e.preventDefault();
    if (!query) return;

    const values = query.split(",").map((f) => f.trim());

    const filters = {
      title: "",
      author: "",
      species: "",
    };
    let valueIndex = 0;

    Object.entries(checked).forEach(([key, isChecked]) => {
      if (isChecked) {
        filters[key as keyof ObservationFilterTypes] = values[valueIndex] || "";
        valueIndex++;
      }
    });

    setSearchFilter({
      title: filters.title,
      author: filters.author,
      species: filters.species,
    });
  };

  useEffect(() => {
    if (!bounds) {
      return;
    }
    observationsService
      .getObservations(bounds, searchFilter)
      .then((obs) => setObservations([...obs]));
  }, [bounds, searchFilter, checked, observationSaved]);

  return (
    <>
      <section className="space-y-4 2xl:space-y-5">
        <div className="rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm 2xl:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold text-green-900 2xl:text-2xl">
              Ekran główny (mapa)
            </h1>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onOpenModal}
                className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 transition hover:bg-green-600"
              >
                Dodaj obserwację
              </button>
            ) : null}
          </div>
          <p className="text-sm text-green-800 2xl:text-base">
            Placeholder przygotowany pod szybkie podpięcie Leaflet i danych
            geolokalizacyjnych.
          </p>
        </div>

        <div className="flex h-[420px] items-center justify-center relative z-0 rounded-xl border-2 border-dashed border-green-300 bg-gradient-to-br from-lime-100 to-amber-100 text-center 2xl:h-[560px]">
          <MapWrapper
            setIsOpenObsModal={setIsOpenObsModal}
            openObservation={openObservation}
            setOpenObservation={setOpenObservation}
            observations={observations}
            setBounds={setBounds}
          />
        </div>

        <ObservationSearch
          handleChangeFilter={handleChangeFilter}
          generatePlaceholder={generatePlaceholder}
          checked={checked}
          handleFilter={handleFilter}
        />
        {<p className="text-xs">Znaleziono {observations.length} obserwacji</p>}
        <ObservationsList
          openObservation={openObservation}
          setOpenObservation={setOpenObservation}
          observations={observations}
          _listType=""
        />
      </section>
      {createPortal(
        <GetObservationModal
          openObservation={openObservation}
          isOpenObsModal={isOpenObsModal}
          setIsOpenObsModal={setIsOpenObsModal}
        />,
        document.body,
      )}
    </>
  );
}
