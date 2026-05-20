import { useRef, useState } from "react";
import { ImageCropperHandle, Observation } from "../../types";
import ImageCropper from "../form/ImageCroppper";
import { observationsService } from "../../services";
import { isAxiosError } from "axios";

interface EditObservationModalProps {
  openObservation: Observation | null;
  setOpenObservation: React.Dispatch<React.SetStateAction<Observation | null>>;
}

interface ErrorStateType {
  title: string[];
  description: string[];
  other: string;
}

export default function EditObservationModal({
  openObservation,
  setOpenObservation,
}: EditObservationModalProps) {
  const CropRef = useRef<ImageCropperHandle>(null);
  const [form, setForm] = useState<Observation | null>(openObservation);
  const [errors, setErrors] = useState<ErrorStateType>({
    title: [],
    description: [],
    other: "",
  });

  const handleChangeInputValue = <K extends keyof Observation>(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: K,
  ) => {
    const val = e.target.value;
    setForm((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: val };
    });
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const img = await CropRef.current?.getCroppedData();
    if (!img || !form) {
      console.log("error");
      return;
    }

    try {
      if (!openObservation) return;
      await observationsService.editObservation(openObservation?.id, {
        ...form,
        img,
      });
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err);
        setErrors((rest) => ({ ...rest, ...err.response?.data }));
      } else {
        console.log(err);
        setErrors((prev) => ({ ...prev, other: "Something goes wrong" }));
      }
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/40 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-green-200 bg-lime-50 p-6 shadow-xl max-h-[90vh] overflow-y-scroll">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-green-900">
            Edytuj obserwację
          </h2>
          <button
            type="button"
            onClick={() => {
              setOpenObservation(null);
            }}
            className="rounded-md px-2 py-1 text-sm font-medium text-green-700 hover:bg-lime-200"
          >
            Zamknij
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-red-600">{errors.other}</p>
          <label htmlFor="title" className="block text-sm text-green-900">
            Tytuł
            <input
              id="title"
              type="text"
              value={form?.title}
              required
              onChange={(event) => handleChangeInputValue(event, "title")}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />
            {errors.title &&
              errors.title.map((element) => {
                return <p className="text-red-600">{element}</p>;
              })}
          </label>

          <label htmlFor="description" className="block text-sm text-green-900">
            Opis
            <textarea
              id="description"
              value={form?.description}
              required
              onChange={(event) => {
                handleChangeInputValue(event, "description");
              }}
              rows={4}
              className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 outline-none focus:border-green-600"
            />
            {errors.description &&
              errors.description.map((element) => {
                return <p className="text-red-600">{element}</p>;
              })}
          </label>

          <ImageCropper
            MIN_WIDTH={300}
            MIN_HEIGHT={150}
            aspectRatioWidth={2}
            aspectRatioHeight={1}
            maxContainerHeight="30vh"
            ref={CropRef}
            imgReverse={form?.img ?? ""}
          />

          <button
            type="submit"
            className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 transition hover:bg-green-600"
          >
            Zapisz obserwację
          </button>
        </form>
      </div>
    </div>
  );
}
