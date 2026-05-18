import { privateApi } from "../../api/privateApi";
import { type BoundsType, type ObservationFilterTypes } from "../../types";

vi.mock("../../api/privateApi", () => ({
  privateApi: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const bounds = {
  _northEast: { lat: 50.0614, lng: 19.9366 },
  _southWest: { lat: 49.9, lng: 19.7 },
} as unknown as BoundsType;

const emptyFilters: ObservationFilterTypes = {
  title: "",
  author: "",
  species: "",
};

describe("observationsService", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it("returns observations mock data", async () => {
    const { observationsMock } = await import("../../mocks");
    const { observationsService } = await import("../../services/observationsService");

    vi.mocked(privateApi.get).mockResolvedValue({ data: observationsMock });

    const observations = await observationsService.getObservations(
      bounds,
      emptyFilters,
    );

    expect(observations).toEqual(observationsMock);
    expect(privateApi.get).toHaveBeenCalledWith("/observations", {
      params: {
        _northEast_lat: 50.0614,
        _northEast_lng: 19.9366,
        _southWest_lat: 49.9,
        _southWest_lng: 19.7,
      },
    });
  });

  it("sends filter params when filters are set", async () => {
    const { observationsService } = await import("../../services/observationsService");

    vi.mocked(privateApi.get).mockResolvedValue({ data: [] });

    const filters: ObservationFilterTypes = {
      title: "Sowa",
      author: "Jan Kowalski",
      species: "Sowa",
    };

    await observationsService.getObservations(bounds, filters);

    expect(privateApi.get).toHaveBeenCalledWith("/observations", {
      params: {
        title: "Sowa",
        author: "Jan Kowalski",
        species: "Sowa",
      },
    });
  });

  it("creates and sends observation to API", async () => {
    const mockResponse = {
      data: {
        id: "o-1",
        userId: "u-1",
        speciesId: 7,
        title: "Nowa obserwacja",
        description: "Test opisu",
        latitude: 50.1,
        longitude: 19.9,
      },
    };

    vi.mocked(privateApi.post).mockResolvedValue(mockResponse);

    const { observationsService } = await import("../../services/observationsService");

    const created = await observationsService.createObservation({
      title: "Nowa obserwacja",
      description: "Test opisu",
      latitude: 50.1,
      longitude: 19.9,
      img: new File([""], "test.jpg"),
    });

    expect(privateApi.post).toHaveBeenCalledWith(
      "/observations/",
      expect.any(FormData),
    );
    expect(created).toEqual(mockResponse);
  });
});
