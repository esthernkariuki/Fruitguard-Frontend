import { fetchDevices } from "./fetchDevices";


const originalFetch = global.fetch;

describe("fetchDevices", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("returns devices data when fetch is successful", async () => {
    const mockData = [{ id: 1, name: "Trap 1" }, { id: 2, name: "Trap 2" }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchDevices();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith("/api/devices");
  });

  it("throws error if response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "Forbidden",
    });

    await expect(fetchDevices()).rejects.toThrow("Something went wrong: Forbidden");
    expect(global.fetch).toHaveBeenCalledWith("/api/devices");
  });

  it("throws error if fetch itself rejects", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    await expect(fetchDevices()).rejects.toThrow("Network error");
    expect(global.fetch).toHaveBeenCalledWith("/api/devices");
  });
});