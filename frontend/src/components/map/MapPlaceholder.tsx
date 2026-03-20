import { Observation } from "../../types";

interface MapPlaceholderProps {
  observations: Observation[];
}

export function MapPlaceholder({ observations }: MapPlaceholderProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Ekran główny (mapa)</h1>
        <p className="text-sm text-slate-600">
          Placeholder przygotowany pod szybkie podpięcie Leaflet i danych geolokalizacyjnych.
        </p>
      </div>

      <div className="flex h-[420px] items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 text-center">
        <div className="space-y-2 px-4">
          <p className="text-lg font-medium text-slate-800">Mapa — placeholder</p>
          <p className="text-sm text-slate-600">
            Liczba obserwacji do wyświetlenia: <strong>{observations.length}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
