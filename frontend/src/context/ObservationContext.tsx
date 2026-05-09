import {
  createContext,
  ReactNode,
  useState,
  useRef,
  useContext,
  useMemo,
} from "react";
import { CoordsType } from "../types";
import { LatLng } from "leaflet";

interface ObservationContextValue {
  isAddObservationOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  handleMapClick: (coords: LatLng) => void;
  activeObservationCoords: CoordsType | null;
  activeMarker: React.RefObject<L.Marker | null>;
}

interface ObservationProviderProps {
  children: ReactNode;
}

const observationContext = createContext<ObservationContextValue | undefined>(
  undefined,
);

export function ObservationProvider({ children }: ObservationProviderProps) {
  const [isAddObservationOpen, setIsAddObservationOpen] = useState(false);
  const [activeObservationCoords, setActiveObservationCoords] =
    useState<CoordsType | null>(null);
  const activeMarker = useRef<L.Marker | null>(null);

  const value = useMemo<ObservationContextValue>(
    () => ({
      isAddObservationOpen,
      onOpenModal: () => setIsAddObservationOpen(true),
      onCloseModal: () => {
        setIsAddObservationOpen(false);
        setActiveObservationCoords(null);
      },

      handleMapClick: (coords: LatLng) => {
        setActiveObservationCoords({
          latitude: coords.lat,
          longitude: coords.lng,
        });
        setIsAddObservationOpen(true);
      },

      activeObservationCoords,
      activeMarker,
    }),
    [isAddObservationOpen, activeObservationCoords, activeMarker],
  );

  return (
    <observationContext.Provider value={value}>
      {children}
    </observationContext.Provider>
  );
}

export function useObservationContext() {
  const context = useContext(observationContext);
  if (!context)
    throw new Error(
      "useObservationContext must be used within ObservationProvider",
    );
  return context;
}
