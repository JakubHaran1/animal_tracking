import { useEffect, useState } from "react";

import { Observation, BoundsType } from "../../types";

import { useAuth } from "../../context/AuthContext";
import { useObservationContext } from "../../context/ObservationContext";

import MapWrapper from "./MapWrapper";
import { ObservationsList } from "../observations/ObservationsList";
import { observationsService } from "../../services";
interface MapPlaceholderProps {
  canAddObservation: boolean;
}

export function MapPlaceholder({ canAddObservation }: MapPlaceholderProps) {
  const { onOpenModal } = useObservationContext();
  const { isAuthenticated, user } = useAuth();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [bounds, setBounds] = useState<BoundsType | null>(null);

  useEffect(() => {
    if (!bounds) {
      return;
    }
    observationsService
      .getObservations(bounds)
      .then((obs) => setObservations([...obs]));
    if (!isAuthenticated || !user || !bounds) {
      return;
    }
  }, [bounds]);
  return (
    <section className="space-y-4 2xl:space-y-5">
      <div className="rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm 2xl:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold text-green-900 2xl:text-2xl">
            Ekran główny (mapa)
          </h1>
          {canAddObservation ? (
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
          canAddObservation={canAddObservation}
          observations={observations}
          setBounds={setBounds}
          bounds={bounds}
        />
      </div>
      <ObservationsList observations={observations} />
    </section>
  );
}
