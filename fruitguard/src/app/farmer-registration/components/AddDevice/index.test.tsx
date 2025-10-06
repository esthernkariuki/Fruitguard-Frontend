import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddDeviceModal from "./";
import * as fetchDevice from "../../../utils/fetchDevice"; 

jest.mock("../../../utils/fetchDevice", () => ({
 addDevice: jest.fn(),
 fetchDevices: jest.fn(), 
}));

describe("AddDeviceModal", () => {
 const mockOnClose = jest.fn();
 const mockOnAddDevice = jest.fn();

 beforeEach(() => {
   jest.clearAllMocks();
 });

 it("renders the modal and form elements correctly", () => {
   render(
     <AddDeviceModal
       farmerId={1}
       onClose={mockOnClose}
       onAddDevice={mockOnAddDevice}
     />
   );
   expect(screen.getByText("Add Device")).toBeInTheDocument();
   expect(screen.getByLabelText("Device Identifier")).toBeInTheDocument();
   expect(screen.getByText("Cancel")).toBeInTheDocument();
   expect(screen.getByText("Add")).toBeInTheDocument();
 });

 it("shows error if device identifier is missing and Add is clicked", async () => {
   render(
     <AddDeviceModal
       farmerId={1}
       onClose={mockOnClose}
       onAddDevice={mockOnAddDevice}
     />
   );

   fireEvent.click(screen.getByText("Add"));
   await waitFor(() =>
     expect(screen.getByText("Device identifier is required")).toBeInTheDocument()
   );
   expect(mockOnAddDevice).not.toHaveBeenCalled();
   expect(mockOnClose).not.toHaveBeenCalled();
 });

 it("submits valid device identifier and calls onAddDevice & onClose", async () => {
   const mockDevice = {
     device_id: 5,
     device_identifier: "ESP32000050",
     status: "active",
     created_at: "2025-01-01T00:00:00Z",
     user_id: 12,
   };

   (fetchDevice.addDevice as jest.Mock).mockResolvedValueOnce(mockDevice);

   render(
     <AddDeviceModal
       farmerId={12}
       onClose={mockOnClose}
       onAddDevice={mockOnAddDevice}
 />
   );

   fireEvent.change(screen.getByPlaceholderText("Enter device identifier"), {
     target: { value: "ESP32000050" },
   });

   fireEvent.click(screen.getByText("Add"));

   await waitFor(() => {
     expect(fetchDevice.addDevice).toHaveBeenCalledWith({
       device_identifier: "ESP32000050",
       status: "active",
       user_id: 12,
     });
     expect(mockOnAddDevice).toHaveBeenCalledWith(mockDevice);
     expect(mockOnClose).toHaveBeenCalled();
     expect(screen.queryByText("Device identifier is required")).not.toBeInTheDocument();
   });
 });

 it("shows API error if addDevice throws an error", async () => {
   (fetchDevice.addDevice as jest.Mock).mockRejectedValueOnce(
     new Error("Failed to add device: Something went wrong: Bad Request")
   );

   render(
     <AddDeviceModal
       farmerId={12}
       onClose={mockOnClose}
       onAddDevice={mockOnAddDevice}
     />
   );

   fireEvent.change(screen.getByPlaceholderText("Enter device identifier"), {
     target: { value: "duplicate_dev" },
   });
   fireEvent.click(screen.getByText("Add"));


   await waitFor(() => {
     expect(screen.getByText("Failed to add device: Something went wrong: Bad Request")).toBeInTheDocument();
     expect(mockOnAddDevice).not.toHaveBeenCalled();
     expect(mockOnClose).not.toHaveBeenCalled();
   });
 });

 it("calls onClose when Cancel is clicked", () => {
   render(
     <AddDeviceModal
       farmerId={12}
       onClose={mockOnClose}
       onAddDevice={mockOnAddDevice}/>
   );
   fireEvent.click(screen.getByText("Cancel"));
   expect(mockOnClose).toHaveBeenCalled();
   expect(mockOnAddDevice).not.toHaveBeenCalled();
 });
});
