import { renderHook, waitFor } from "@testing-library/react";
import { useFetchUsers } from "./useFetchUsers";
import { fetchUsers } from "../utils/fetchUsers";

jest.mock("../utils/fetchUsers");

const mockFetchUsers = fetchUsers as jest.Mock;

describe("useFetchUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return an initial loading state", () => {
    mockFetchUsers.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useFetchUsers());

    expect(result.current.loading).toBe(true);
    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  test("should fetch and return data successfully", async () => {
    const mockUsersResponse = [
      {
        id: 1,
        first_name: "Joanne",
        last_name: "Mwikali",
        phone_number: "0718230987",
        email: "joanne@gmail.com",
        profile_image: null,
        location: "Yatta",
        number_of_traps: "3",
        user_type: "farmer",
        created_at: "2025-09-05",
      },
    ];

    mockFetchUsers.mockResolvedValue(mockUsersResponse);

    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toEqual(mockUsersResponse);
    expect(result.current.error).toBe(null);
  });

  test("should handle fetching errors", async () => {
    const mockError = new Error("Network error during user fetch");

    mockFetchUsers.mockRejectedValue(mockError);
    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe(mockError.message);
  });

  test("should return empty data when API call returns empty array", async () => {
    mockFetchUsers.mockResolvedValue([]);

    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe(null);
  });
});