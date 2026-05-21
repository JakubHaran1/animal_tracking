import { Observation } from "../../types";

interface ObservationsListProps {
  openObservation: Observation | null;
  setOpenObservation: React.Dispatch<React.SetStateAction<Observation | null>>;
  observations: Observation[];
  _listType: string;
}

export default function ObservationsList({
  openObservation,
  setOpenObservation,
  observations,
  _listType,
}: ObservationsListProps) {
  return (
    <>
      {observations.length > 0 && (
        <ul
          className={`space-y-3 flex flex-col items-center gap-3 overflow-y-hidden  mt-4 py-2 `}
        >
          {observations.map((obs) => {
            return (
              <li
                onClick={() => {
                  if (_listType) return;
                  if (openObservation?.id === obs.id) setOpenObservation(null);
                  else setOpenObservation(obs);
                }}
                key={obs.id}
                className={`flex w-full md:w-3/4 hrink-0 gap-3 overflow-hidden rounded-xl border border-green-200 bg-lime-50 p-2  p:md-4 shadow-sm duration-300 ease-in
                 ${openObservation?.id === obs.id && "bg-lime-100 -translate-y-1"} ${!_listType && "cursor-pointer"}`}
              >
                {_listType && (
                  <button
                    className="cursor-pointer"
                    onClick={() => {
                      if (openObservation?.id === obs.id)
                        setOpenObservation(null);
                      else setOpenObservation(obs);
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square "></i>
                  </button>
                )}
                <img
                  className="w-1/3 rounded-sm aspect-2/1"
                  src={obs.img_thumbnail}
                  alt="img"
                />

                <div className="info w-2/3 bg-white p-3 rounded-md">
                  <h3 className="truncate border-b-1 pb-1 ">
                    <span className="me-2 italic">Tytuł:</span>
                    {obs.title}
                  </h3>
                  <p>
                    {" "}
                    <span className="me-2 italic">Gatunek:</span>
                    {obs.speciesName}
                  </p>
                  <p className="hidden md:block line-clamp-3 mt-2  ">
                    <span className="me-2 italic block ">Opis:</span>
                    <span className="px-1"> {obs.description}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
