import { Observation } from "../../types";
import { useEffect } from "react";
import ObservationSearch from "./ObservationSearch";
interface ObservationsListProps {
  observations: Observation[];
}

export default function ObservationsList({
  observations,
}: ObservationsListProps) {
  if (observations.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
        <p>There is nothing to see</p>
        <p>Move map or change filters</p>
      </div>
    );
  }

  return (
    <>
      <ObservationSearch />
      {<p className="text-xs">Znaleziono {observations.length} obserwacji</p>}

      <ul className="space-y-3 flex flex-col items-center gap-3 overflow-y-hidden  mt-4 py-2">
        {observations.map((obs) => {
          return (
            <li
              key={obs.id}
              className="flex w-full md:w-3/4 hrink-0 gap-3 overflow-hidden rounded-xl border border-green-200 bg-lime-50 p-2  p:md-4 shadow-sm"
            >
              <img className=" w-1/3" src={`${obs.img}`} alt="img" />
              <div className="info w-2/3">
                <h3 className="truncate border-b-1 pb-2 ">{obs.title}</h3>

                <p className="hidden md:block line-clamp-3 mt-2 px-1 ">
                  {obs.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
