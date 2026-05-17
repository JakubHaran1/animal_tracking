import { Observation } from "../../types";

interface ObservationsListProps {
  openObservationID: string;
  setOpenObservationID: React.Dispatch<React.SetStateAction<string>>;
  observations: Observation[];
}

export default function ObservationsList({
  openObservationID,
  setOpenObservationID,
  observations,
}: ObservationsListProps) {
  return (
    <>
      {observations.length > 0 && (
        <ul className="space-y-3 flex flex-col items-center gap-3 overflow-y-hidden  mt-4 py-2">
          {observations.map((obs) => {
            return (
              <li
                onClick={() => {
                  if (openObservationID === obs.id) setOpenObservationID("");
                  else setOpenObservationID(obs.id);
                }}
                key={obs.id}
                className={`flex w-full md:w-3/4 hrink-0 gap-3 overflow-hidden rounded-xl border border-green-200 bg-lime-50 p-2  p:md-4 shadow-sm duration-300 ease-in
                 ${openObservationID === obs.id && "bg-lime-100 -translate-y-1"}`}
              >
                <img className=" w-1/3" src={`${obs.img}`} alt="img" />
                <div className="info w-2/3">
                  <h3 className="truncate border-b-1 pb-2 ">{obs.title}</h3>

                  <p className="hidden md:block line-clamp-3 mt-2 px-1 ">
                    {obs.description}
                  </p>
                </div>
                <p>{openObservationID}</p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
