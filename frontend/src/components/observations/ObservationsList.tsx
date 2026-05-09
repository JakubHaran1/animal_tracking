import { Observation } from "../../types";
import { useEffect } from "react";
interface ObservationsListProps {
  observations: Observation[];
}

export function ObservationsList({ observations }: ObservationsListProps) {
  if (observations.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
        <p>There is nothing to see</p>
        <p>Move map or change filters</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 flex flex-row gap-3 overflow-x-scroll overflow-y-hidden  mt-4 p-2">
      {observations.map((obs) => {
        return (
          <li
            key={obs.id}
            className="flex flex-col w-md shrink-0 gap-3 text-center rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm"
          >
            <img src="" alt="img" />
            <h3>{obs.title}</h3>
            <p>{obs.description}</p>
            <p>{obs.latitude}</p>
            <p>{obs.longitude}</p>
          </li>
        );
      })}
    </ul>
  );
}
