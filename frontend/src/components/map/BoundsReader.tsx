import { useMapEvent } from "react-leaflet";
import { BoundsType } from "../../types";
export const BoundsReader = ({
  setBounds,
}: {
  setBounds: React.Dispatch<React.SetStateAction<BoundsType | null>>;
}) => {
  const map = useMapEvent("moveend", () => {
    const bounds = map.getBounds();
    const _northEast = bounds.getNorthEast();
    const _southWest = bounds.getSouthWest();
    setBounds({ _northEast, _southWest });
  });
  return null;
};
