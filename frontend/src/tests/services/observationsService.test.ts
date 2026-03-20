import { observationsMock } from "../../mocks";
import { observationsService } from "../../services/observationsService";

describe("observationsService", () => {
  it("returns observations mock data", async () => {
    const observations = await observationsService.getObservations();

    expect(observations).toEqual(observationsMock);
  });
});
