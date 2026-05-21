import { Observation } from "../../types";
type GetObsModalProps = {
  setIsOpenObsModal: React.Dispatch<React.SetStateAction<boolean>>;
  openObservation: Observation | null;
};

export default function GetObservationModal({
  setIsOpenObsModal,
  openObservation,
}: GetObsModalProps) {
  if (openObservation == null) return "";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/40 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-green-200 bg-lime-50 p-6 shadow-xl max-h-[90vh] overflow-y-scroll">
        <div className="mb-4 flex items-start justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setIsOpenObsModal(false);
            }}
            className="rounded-md px-2 py-1 text-sm font-medium text-green-700 hover:bg-lime-200"
          >
            Zamknij
          </button>
        </div>
        <div className="observation-context">
          <img
            className="rounded-xl"
            src={openObservation.img}
            alt={`Zdjęcie obserwacji: ${openObservation.title}`}
          />
          <h2 className="text-xl font-semibold text-green-900 my-2">
            {openObservation.title}
          </h2>

          <p className="mb-6">{openObservation.description}</p>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 transition hover:bg-green-600"
          onClick={() => setIsOpenObsModal(false)}
        >
          Zamknij okno
        </button>
      </div>
    </div>
  );
}
