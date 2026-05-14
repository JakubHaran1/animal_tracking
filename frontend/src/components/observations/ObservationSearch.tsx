import { useRef } from "react";
import { CheckedFilterTypes } from "../../types";

type SearchProps = {
  handleChangeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  generatePlaceholder: string;
  checked: CheckedFilterTypes;
  handleFilter: (
    e: React.SubmitEvent<HTMLFormElement>,
    query: string | undefined,
  ) => void;
};

export default function ObservationSearch({
  handleChangeFilter,
  generatePlaceholder,
  checked,
  handleFilter,
}: SearchProps) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="flex flex-col md:flex-row items-start  gap-4">
        <h3>Wyszukuj po:</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="title">Tytule obserwacji</label>
          <input
            onChange={(e) => {
              handleChangeFilter(e);
            }}
            checked={checked.title}
            id="title"
            value="title"
            type="checkbox"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="author">Autorze</label>
          <input
            onChange={(e) => handleChangeFilter(e)}
            checked={checked.author}
            id="author"
            value="author"
            type="checkbox"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="species">Gatunku</label>
          <input
            onChange={(e) => handleChangeFilter(e)}
            checked={checked.species}
            id="species"
            value="species"
            type="checkbox"
          />
        </div>
      </div>

      <form
        onSubmit={(e) => handleFilter(e, input.current?.value)}
        className="rounded-xl border border-green-200 bg-white p-4 mb-2 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            ref={input}
            placeholder={generatePlaceholder}
            className="w-full rounded-md border border-green-200 px-3 py-2 text-sm text-green-900 outline-none focus:border-green-600"
          />
          <button
            type="submit"
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 transition hover:bg-green-600"
          >
            {/* {isSearching ? "Szukam..." : "Szukaj"} */}
            Szukaj
          </button>
        </div>
        {/* {error ? <p className="mt-3 text-sm text-amber-700">{error}</p> : null} */}
      </form>
    </>
  );
}
