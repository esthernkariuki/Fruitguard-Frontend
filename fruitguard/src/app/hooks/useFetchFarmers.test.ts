import { renderHook, waitFor } from "@testing-library/react";
import * as fetchModule from "../utils/fetchFarmers";
import { useFetchFarmers } from "../hooks/useFetchFarmers";

jest.mock("../utils/fetchFarmers");

describe("useFetchFarmers hook", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("loads farmers data successfully", async () => {
    const mockFarmers = [{ id: 1, name: "John" }];
    (fetchModule.fetchFarmers as jest.Mock).mockResolvedValueOnce(mockFarmers);
    const { result } = renderHook(() => useFetchFarmers());

    expect(result.current.loading).toBe(true);
    expect(result.current.farmers).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.farmers).toEqual(mockFarmers);
      expect(result.current.error).toBeNull();
    });
  });

  it("handles errors correctly", async () => {
    const errorMessage = "Failed to fetch";
    (fetchModule.fetchFarmers as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useFetchFarmers());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.farmers).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("handles null values from backend", async () => {
    (fetchModule.fetchFarmers as jest.Mock).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useFetchFarmers());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.farmers).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });
});
