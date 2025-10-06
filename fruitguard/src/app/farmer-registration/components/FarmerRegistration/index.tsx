"use client";
import { useState } from "react";
import Button from "../../../sharedComponents/Button";
import { addFarmers } from "../../../utils/fetchUsers";
import { UserType } from "../../../utils/types/users";

interface Props {
  open: boolean;
  onClose: () => void;
  onRegister: (farmer: UserType) => void;
  onSnackbar: (message: string, severity: "success" | "error") => void;
}

export default function RegisterFarmerModal({ onClose, onRegister, onSnackbar }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [numberOfTraps, setNumberOfTraps] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        location,
        number_of_traps: numberOfTraps,
        user_type: "farmer" as const,
      };

      const newUser = await addFarmers(payload);

      const newFarmer: UserType = {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone_number: newUser.phone_number,
        email: newUser.email ?? null,
        profile_image: newUser.profile_image ?? null,
        location: newUser.location,
        number_of_traps: newUser.number_of_traps,
        user_type: newUser.user_type,
        created_at: newUser.created_at ?? new Date().toISOString(),
      };

      onRegister(newFarmer);
      onSnackbar("Farmer registered successfully!", "success");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message ? error.message : "Farmer already exists";
      onSnackbar(errorMessage, "error");
    }
  }

  return (
    <div className="fixed inset-0 bg-[#7B3F30]/40 flex items-center justify-center z-50 text-[18px]">
      <form
        className="bg-white rounded-xl shadow-lg p-10 w-[500px] flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-[#7B3F30] text-xl font-bold mb-2 text-[18px]">Register Farmer</h2>

        <div>
          <label htmlFor="firstName" className="block mb-1">
            First Name
          </label>
          <input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 italic"
            placeholder="Enter farmer’s first name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 italic"
            placeholder="Enter farmer’s last name"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 italic"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label htmlFor="location" className="block mb-1">
            Location
          </label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 italic"
            placeholder="Enter location"
          />
        </div>
        <div>
          <label htmlFor="numberOfTraps" className="block mb-1">
            Number of Traps
          </label>
          <input
            id="numberOfTraps"
            value={numberOfTraps}
            onChange={(e) => setNumberOfTraps(e.target.value)}
            required
            type="number"
            className="w-full border rounded px-3 py-2 italic"
            placeholder="Enter number of traps"
          />
        </div>

        <div className="flex gap-4 mt-4 justify-between">
          <Button
            buttonText="Cancel"
            variant="secondary"
            onClickHandler={onClose}
            className="px-6 py-2 rounded font-semibold bg-[#FDF6EC]"
          />
          <Button
            buttonText="Register"
            variant="default"
             onClickHandler={() => {}} 
            className="px-6 py-2 rounded font-semibold bg-[#7B3F30]"
          />
        </div>
      </form>
    </div>
  );
}