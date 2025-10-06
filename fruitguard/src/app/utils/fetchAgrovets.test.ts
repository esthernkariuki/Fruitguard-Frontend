import { fetchAgrovets } from "./fetchAgrovets";


const originalFetch = global.fetch;

describe("fetchAgrovets", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("returns agrovets data when fetch is successful", async () => {
    const mockData = [{ id: 1, first_name: "John", last_name: "Doe" }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchAgrovets();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith("/api/users");
  });

  it("throws error if response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "Unauthorized",
    });

    await expect(fetchAgrovets()).rejects.toThrow("Something went wrong: Unauthorized");
    expect(global.fetch).toHaveBeenCalledWith("/api/users");
  });

  it("throws error if fetch itself rejects", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network down"));

    await expect(fetchAgrovets()).rejects.toThrow("Failed to fetch agrovets: Network down");
    expect(global.fetch).toHaveBeenCalledWith("/api/users");
  });
});