import { useEffect, useState } from "react";
import { MapPlaceholder } from "../components";
import { observationsService } from "../services";
import { Observation } from "../types";

export function HomePage() {
  const [observations, setObservations] = useState<Observation[]>([]);

  useEffect(() => {
    observationsService.getObservations().then(setObservations);
  }, []);

  return <MapPlaceholder observations={observations} />;
}
