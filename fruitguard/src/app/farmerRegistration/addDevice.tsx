"use client";
import { useState } from "react";

interface Props {
  farmerId: string;
  onClose: () => void;
  onAddDevice: (device: {
    device_id: number;
    device_identifier: string;
    status: string;
    created_at: string;
    user_id: number;
  }) => void;
}

export default function AddDeviceModal({ farmerId, onClose, onAddDevice }: Props) {
  const [deviceIdentifier, setDeviceIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!deviceIdentifier) {
        throw new Error("Device identifier is required");
      }

      const payload = {
        device_identifier: deviceIdentifier,
        user_id: parseInt(farmerId, 10),
        status: "active",
      };

      const response = await fetch("/api/device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.non_field_errors?.join(" ") ||
          errorData.device_identifier?.join(" ") ||
          (response.status === 404
            ? "Error adding device."
            : `HTTP error ${response.status}`);
        throw new Error(errorMessage);
      }

      const newDevice = await response.json();
      onAddDevice(newDevice);
      setError(null);
      setDeviceIdentifier("");
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#7B3F30]/40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-xl shadow-lg p-10 w-[400px] flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-[#7B3F30] text-xl font-bold mb-2">Add Device</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div>
          <label className="block mb-1 font-semibold">Device Identifier</label>
          <input
            value={deviceIdentifier}
            onChange={(e) => setDeviceIdentifier(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Enter device identifier"
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
}