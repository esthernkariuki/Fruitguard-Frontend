import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FarmerDetailsModal from "./";

jest.mock("../../../hooks/useFetchDevice", () => ({
  useFetchDevices: jest.fn(),
}));

jest.mock("../../../hooks/useFetchUsers", () => ({
  useFetchUsers: jest.fn(),
}));

jest.mock("../AddDevice", () => ({
  __esModule: true,
  default: ({ farmerId, onClose, onAddDevice }: any) => (
    <div data-testid="add-device-modal">
      <button
        onClick={() => {
          onAddDevice();
          onClose();
        }}
      >
        Mock Add Device
      </button>
    </div>
  ),
}));

const mockFarmer = {
  id: "1",
  name: "Mary Nduku",
  phone: "0713200280",
  location: "Kitui",
};

const mockDevices = [
  { device_id: 1, device_identifier: "ESP32000078", status: "active", user_id: 1 },
  { device_id: 2, device_identifier: "ESP3200006780", status: "inactive", user_id: 2 },
];

describe("FarmerDetailsModal", () => {
  const mockUseFetchDevices = require("../../../hooks/useFetchDevice").useFetchDevices;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFetchDevices.mockReturnValue({
      devices: mockDevices,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("shows loading state", () => {
    mockUseFetchDevices.mockReturnValue({
      devices: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });
    render(<FarmerDetailsModal farmer={mockFarmer} onClose={jest.fn()} />);
    expect(screen.getByText("Loading devices...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseFetchDevices.mockReturnValue({
      devices: [],
      loading: false,
      error: "Failed to load",
      refetch: jest.fn(),
    });
    render(<FarmerDetailsModal farmer={mockFarmer} onClose={jest.fn()} />);
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("shows 'No devices registered' if farmer has no devices", () => {
    mockUseFetchDevices.mockReturnValue({
      devices: [],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    render(<FarmerDetailsModal farmer={mockFarmer} onClose={jest.fn()} />);
    expect(screen.getByText("No devices registered")).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked", () => {
    const onClose = jest.fn();
    render(<FarmerDetailsModal farmer={mockFarmer} onClose={onClose} />);
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows AddDeviceModal when Add device is clicked, and hides after adding", async () => {
    const refetch = jest.fn();
    mockUseFetchDevices.mockReturnValue({
      devices: mockDevices,
      loading: false,
      error: null,
      refetch,
    });
    render(<FarmerDetailsModal farmer={mockFarmer} onClose={jest.fn()} />);
    fireEvent.click(screen.getByText("Add device"));
    expect(screen.getByTestId("add-device-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Mock Add Device"));
    await waitFor(() => {
      expect(screen.queryByTestId("add-device-modal")).not.toBeInTheDocument();
    });
    expect(refetch).toHaveBeenCalled();
  });
});
