describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses /api as default baseURL", async () => {
    vi.unstubAllEnvs();
    const { apiClient } = await import("../../services/apiClient");

    expect(apiClient.defaults.baseURL).toBe("/api");
    expect(apiClient.defaults.timeout).toBe(10000);
  });

  it("uses env baseURL when provided", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://example.test/api");
    const { apiClient } = await import("../../services/apiClient");

    expect(apiClient.defaults.baseURL).toBe("https://example.test/api");
  });
});
