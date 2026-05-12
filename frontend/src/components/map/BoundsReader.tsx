import { useMapEvent } from "react-leaflet";
import { useRef } from "react";
import { BoundsType } from "../../types";

export const BoundsReader = ({
  setBounds,
}: {
  setBounds: React.Dispatch<React.SetStateAction<BoundsType | null>>;
}) => {
  const boundsRef = useRef<BoundsType>(null);
  const map = useMapEvent("moveend", () => {
    const boundsObj = map.getBounds();

    const newBounds = {
      _northEast: boundsObj.getNorthEast(),
      _southWest: boundsObj.getSouthWest(),
    };

    if (!boundsRef.current) {
      boundsRef.current = newBounds;
      setBounds(newBounds);
      return;
    }

    const latSize = newBounds._northEast.lat - newBounds._southWest.lat;
    const lngSize = newBounds._northEast.lng - newBounds._southWest.lng;

    const latDiff = Math.abs(
      boundsRef.current._northEast.lat - newBounds._northEast.lat,
    );

    const lngDiff = Math.abs(
      boundsRef.current._northEast.lng - newBounds._northEast.lng,
    );

    const moveEnough = latDiff >= latSize * 0.3 || lngDiff >= lngSize * 0.3;
    console.log(latDiff, latSize * 0.3);
    if (moveEnough) {
      boundsRef.current = newBounds;
      console.log("fetching");
      setBounds(newBounds);
    }
  });
  return null;
};
