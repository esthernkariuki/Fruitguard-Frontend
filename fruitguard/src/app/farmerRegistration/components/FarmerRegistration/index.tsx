"use client";
import { useState } from "react";
import { Farmer } from "../../../hooks/useFetchUsers";

interface Props {
  onClose: () => void;
  onRegister: (farmer: Farmer) => void;
}

export default function RegisterFarmerModal({ onClose, onRegister }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [numberOfTraps, setNumberOfTraps] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        location,
        number_of_traps: numberOfTraps,
        user_type: "farmer",
      };

      console.log("POST Payload (users):", payload);
      console.log("Fetching URL:", "/api/users");

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("Backend Error Data (users):", {
          status: response.status,
          url: response.url,
          errorData,
        });
        throw new Error(
          errorData.detail || `Failed to register farmer: HTTP ${response.status}`
        );
      }

      const newUser = await response.json();
      const newFarmer: Farmer = {
        id: newUser.id.toString(),
        name: `${newUser.first_name} ${newUser.last_name}`,
        phone: newUser.phone_number,
        traps: parseInt(newUser.number_of_traps, 10) || 0,
        location: newUser.location,
        devices: [],
        user_type: newUser.user_type,
      };

      onRegister(newFarmer);
      onClose();
    } catch (err) {
      setError((err as Error).message);
      console.error("POST Error (users):", err);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#7B3F30]/40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-xl shadow-lg p-10 w-[500px] flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-[#7B3F30] text-xl font-bold mb-2">Register Farmer</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div>
          <label className="block mb-1 font-semibold">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Enter farmer’s first name"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Enter farmer’s last name"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Enter location"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Number of Traps</label>
          <input
            value={numberOfTraps}
            onChange={(e) => setNumberOfTraps(e.target.value)}
            required
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter number of traps"
          />
        </div>
        <div className="flex gap-4 mt-4 justify-end">
          <button
            type="button"
            className="bg-[#FDF6EC] text-[#7B3F30] px-6 py-2 rounded font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#7B3F30] text-white px-6 py-2 rounded font-semibold"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}