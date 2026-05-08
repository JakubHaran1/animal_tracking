describe("observationsService", () => {
  afterEach(() => {
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

  it("creates and prepends a new observation", async () => {
    const { observationsService } = await import("../../services/observationsService");

    const created = await observationsService.createObservation({
      userId: "u-1",
      speciesId: 7,
      title: "Nowa obserwacja",
      description: "Test opisu",
      latitude: 50.1,
      longitude: 19.9,
    });

    expect(created.id).toContain("o-local-");
    expect(created.userId).toBe("u-1");
    expect(created.speciesId).toBe(7);
    expect(created.title).toBe("Nowa obserwacja");

    const all = await observationsService.getObservations();
    expect(all[0]).toEqual(created);
  });
});
