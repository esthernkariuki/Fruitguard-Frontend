import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as useFetchUsersHook from "../../../hooks/useFetchUsers";
import FarmersPage from "./";

jest.mock("../FarmerRegistration", () => ({
  default: ({ onClose, onRegister }: any) => (
    <div data-testid="register-farmer-modal">
      <button
        onClick={() => {
          onRegister({
            id: "3",
            first_name: "Peris",
            last_name: "Nduku",
            phone_number: "0733456765",
            number_of_traps: 2,
            location: "Makueni",
            devices: [],
            user_type: "farmer",
          });
          onClose();
        }}
      >
        Mock Register Farmer
      </button>
    </div>
  ),
}));

jest.mock("../FarmerDetails", () => ({
  default: ({ farmer, onClose }: any) => (
    <div data-testid="farmer-details-modal">
      <div>{`${farmer.first_name} ${farmer.last_name}`}</div>
      <button onClick={onClose}>Close Details</button>
    </div>
  ),
}));

jest.mock("../../../hooks/useFetchUsers", () => ({
  useFetchUsers: jest.fn(),
}));

jest.mock("../../../hooks/useFetchDevice", () => ({
  useFetchDevice: jest.fn(() => ({
    devices: [{ id: 1, name: "Device 1" }],
    loading: false,
    error: null,
    fetchData: jest.fn().mockResolvedValue([{ id: 1, name: "Device 1" }]),
  })),
}));

const mockFarmers = [
  {
    id: "2",
    first_name: "Mary",
    last_name: "Nduku",
    phone_number: "0713200280",
    number_of_traps: 4,
    location: "Kitui",
    user_type: "farmer",
  },
  {
    id: "1",
    first_name: "Brian",
    last_name: "Mututku",
    phone_number: "0798765432",
    number_of_traps: 1,
    location: "Maua",
    user_type: "farmer",
  },
];

describe("FarmersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useFetchUsersHook.useFetchUsers as jest.Mock).mockReturnValue({
      users: mockFarmers,
      loading: false,
      setUsers: jest.fn(),
      refetch: jest.fn(),
      error: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders farmers table with correct farmers", () => {
    render(<FarmersPage />);
    expect(screen.getByText("Farmer's Registration")).toBeInTheDocument();
    expect(screen.getByText("Mary Nduku")).toBeInTheDocument();
    expect(screen.getByText("Brian Mututku")).toBeInTheDocument();
  });

  it("shows loading message", () => {
    (useFetchUsersHook.useFetchUsers as jest.Mock).mockReturnValue({
      users: [],
      loading: true,
      setUsers: jest.fn(),
      refetch: jest.fn(),
      error: null,
    });
    render(<FarmersPage />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("shows error message", () => {
    (useFetchUsersHook.useFetchUsers as jest.Mock).mockReturnValue({
      users: [],
      loading: false,
      setUsers: jest.fn(),
      refetch: jest.fn(),
      error: "Failed to fetch",
    });
    render(<FarmersPage />);
    expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
  });

  it("shows 'No farmers found' if filter returns nothing", () => {
    (useFetchUsersHook.useFetchUsers as jest.Mock).mockReturnValue({
      users: [],
      loading: false,
      setUsers: jest.fn(),
      refetch: jest.fn(),
      error: null,
    });
    render(<FarmersPage />);
    expect(screen.getByText("No farmers found")).toBeInTheDocument();
  });

  it("filters farmers by search", () => {
    render(<FarmersPage />);
    fireEvent.change(screen.getByLabelText(/search farmers by name/i), {
      target: { value: "Brian" },
    });
    expect(screen.getByText("Brian Mututku")).toBeInTheDocument();
    expect(screen.queryByText("Mary Nduku")).not.toBeInTheDocument();
  });

  it("handles page navigation", () => {
    const manyFarmers = Array.from({ length: 24 }, (_, i) => ({
      id: `${i + 1}`,
      first_name: `Farmer${i + 1}`,
      last_name: "Test",
      phone_number: `07${i}000000`,
      number_of_traps: i,
      location: "Location",
      user_type: "farmer",
    }));
    (useFetchUsersHook.useFetchUsers as jest.Mock).mockReturnValue({
      users: manyFarmers,
      loading: false,
      setUsers: jest.fn(),
      refetch: jest.fn(),
      error: null,
    });
    render(<FarmersPage />);
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Previous"));
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });
});