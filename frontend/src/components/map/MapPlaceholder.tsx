import { useEffect, useMemo, useState } from "react";

import {
  BoundsType,
  CheckedFilterTypes,
  Observation,
  ObservationFilterTypes,
} from "../../types";

import MapWrapper from "./MapWrapper";
import ObservationsList from "../observations/ObservationsList";
import ObservationSearch from "../observations/ObservationSearch";

import { observationsService } from "../../services";

export function MapPlaceholder() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [bounds, setBounds] = useState<BoundsType | null>(null);

  const [searchFilter, setSearchFilter] = useState<ObservationFilterTypes>({
    title: "",
    author: "",
    species: "",
  });
  const [checked, setChecked] = useState<CheckedFilterTypes>({
    title: false,
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
  }, [bounds, searchFilter, checked]);

  return (
    <section className="space-y-4 2xl:space-y-5">
      <div className="flex h-[420px] items-center justify-center relative z-0 rounded-xl border-2 border-dashed border-green-300 bg-gradient-to-br from-lime-100 to-amber-100 text-center 2xl:h-[560px]">
        <MapWrapper
          observations={observations}
          setBounds={setBounds}
          bounds={bounds}
        />
      </div>

      <ObservationSearch
        handleChangeFilter={handleChangeFilter}
        generatePlaceholder={generatePlaceholder}
        checked={checked}
        handleFilter={handleFilter}
      />
      {<p className="text-xs">Znaleziono {observations.length} obserwacji</p>}
      <ObservationsList observations={observations} />
    </section>
  );
}
