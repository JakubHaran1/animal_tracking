import { Observation } from "../../types";

interface MapPlaceholderProps {
  observations: Observation[];
}

export function MapPlaceholder({ observations }: MapPlaceholderProps) {
  return (
    <section className="space-y-4 2xl:space-y-5">
      <div className="rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm 2xl:p-5">
        <h1 className="text-xl font-semibold text-green-900 2xl:text-2xl">Ekran główny (mapa)</h1>
        <p className="text-sm text-green-800 2xl:text-base">
          Placeholder przygotowany pod szybkie podpięcie Leaflet i danych geolokalizacyjnych.
        </p>
      </div>

      <div className="flex h-[420px] items-center justify-center rounded-xl border-2 border-dashed border-green-300 bg-gradient-to-br from-lime-100 to-amber-100 text-center 2xl:h-[560px]">
        <div className="space-y-2 px-4 2xl:space-y-3">
          <p className="text-lg font-medium text-green-900 2xl:text-2xl">Mapa — placeholder</p>
          <p className="text-sm text-green-800 2xl:text-base">
            Liczba obserwacji do wyświetlenia: <strong>{observations.length}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
