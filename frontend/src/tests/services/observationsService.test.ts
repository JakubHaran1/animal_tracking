import { privateApi } from "../../api/privateApi";

vi.mock("../../api/privateApi", () => ({
  privateApi: {
    post: vi.fn(),
  },
}));

describe("observationsService", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it("returns observations mock data", async () => {
    const { observationsMock } = await import("../../mocks");
    const { observationsService } = await import("../../services/observationsService");

    const observations = await observationsService.getObservations();

    expect(observations).toEqual(observationsMock);
  });

  it("filters observations by user ids", async () => {
    const { observationsService } = await import("../../services/observationsService");

    const all = await observationsService.getObservations();
    const includedUserId = all[0]?.userId;

    expect(includedUserId).toBeDefined();

    const filtered = await observationsService.getObservationsByUserIds([
      includedUserId as string,
      "missing-user",
    ]);

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((observation) => observation.userId === includedUserId)).toBe(true);
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
