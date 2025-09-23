import { fetchFarmers } from "../utils/fetchFarmers";

describe("fetchFarmers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when fetch is successful", async () => {
    const mockData = [{ id: 1, name: "Jane" }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );
    const result = await fetchFarmers();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("api/users");
  });

  it("throws error when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Server error",
      } as Response)
    );
    await expect(fetchFarmers()).rejects.toThrow("couldn’t load the farmers list: Server error");
  });

  it("throws error on network failure", async () => {
    const msg = "Network failure";
    global.fetch = jest.fn(() => Promise.reject(new Error(msg)));
    await expect(fetchFarmers()).rejects.toThrow("Something went wrong while loading the farmers list: " + msg);
  });

  it("returns null when backend returns null", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(null),
      } as Response)
    );
    const result = await fetchFarmers();
    expect(result).toBeNull();
  });
});
