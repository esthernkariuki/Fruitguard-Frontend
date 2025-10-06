import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterFarmerModal from ".";
import "@testing-library/jest-dom";

describe("RegisterFarmerModal", () => {
  const onClose = jest.fn();
  const onRegister = jest.fn();
  const onSnackbar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(
      <RegisterFarmerModal
        open={true}
        onClose={onClose}
        onRegister={onRegister}
        onSnackbar={onSnackbar}
      />
    );
    expect(screen.getByText("Register Farmer")).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Traps/i)).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(
      <RegisterFarmerModal
        open={true}
        onClose={onClose}
        onRegister={onRegister}
        onSnackbar={onSnackbar}
      />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("submits the form and calls onRegister and onClose on success", async () => {
    const apiResponse = {
      id: 10, 
      first_name: "Peris",
      last_name: "Nduku",
      phone_number: "0722009900",
      number_of_traps: "5",
      location: "Kitui",
      user_type: "farmer",
      created_at: "2025-10-06T08:01:58.269Z",
      email: null,
      profile_image: null,
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => apiResponse,
    });

    render(
      <RegisterFarmerModal
        open={true}
        onClose={onClose}
        onRegister={onRegister}
        onSnackbar={onSnackbar}
      />
    );
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "Peris" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "Nduku" },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: "0722009900" },
    });
    fireEvent.change(screen.getByPlaceholderText(/location/i), {
      target: { value: "Kitui" },
    });
    fireEvent.change(screen.getByPlaceholderText(/number of traps/i), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(onRegister).toHaveBeenCalledWith({
        id: 10,
        first_name: "Peris",
        last_name: "Nduku",
        phone_number: "0722009900",
        number_of_traps: "5",
        location: "Kitui",
        user_type: "farmer",
        created_at: "2025-10-06T08:01:58.269Z",
        email: null,
        profile_image: null,
      });
      expect(onClose).toHaveBeenCalled();
      expect(onSnackbar).toHaveBeenCalledWith(
        "Farmer registered successfully!",
        "success"
      );
    });

    (global.fetch as jest.Mock).mockRestore();
  });
});