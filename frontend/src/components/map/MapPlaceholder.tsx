import { Observation, CoordsType } from "../../types";
import MapWrapper from "./MapWrapper";

interface MapPlaceholderProps {
  observations: Observation[];
  canAddObservation: boolean;
  onAddObservationClick: () => void;
  handleMapClick: (coords: CoordsType) => void;
}

export function MapPlaceholder({
  observations,
  canAddObservation,
  onAddObservationClick,
  handleMapClick,
}: MapPlaceholderProps) {
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
              onClick={onAddObservationClick}
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
          handleMapClick={handleMapClick}
        />
      </div>
    </section>
  );
}
