"use client";
import { useState } from "react";
import Button from "../../../sharedComponents/Button";
import { addDevice } from "../../../utils/fetchDevice";
import { Devices } from "../../../utils/types/device";

interface Props {
  farmerId: number;
  onClose: () => void;
  onAddDevice: (device: Devices) => void;
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
        status: "active",
        user_id: farmerId, 
      };
      
      const newDevice = await addDevice(payload); 
      
      onAddDevice(newDevice);
      setError(null);
      setDeviceIdentifier("");
      onClose();
    } catch (error) {
      setError((error as Error).message);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#7B3F30]/40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-xl p-10 w-[400px] flex flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-[#7B3F30] text-xl font-bold mb-2">Add Device</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div>
          <label className="block mb-1 font-semibold">
            Device Identifier
            <input
              value={deviceIdentifier}
              onChange={(e) => setDeviceIdentifier(e.target.value)}
              className="w-full border rounded px-3 py-2 italic"
              placeholder="Enter device identifier"
            />
          </label>
        </div>
        <div className="flex gap-4 mt-4 justify-between">
          <Button
            buttonText="Cancel"
            variant="secondary"
            onClickHandler={onClose}
            className="px-6 py-2 rounded font-semibold bg-[#FDF6EC]"
          />
          <Button
            buttonText="Add"
            variant="default"
            onClickHandler={() => {}}
            className="px-6 py-2 rounded font-semibold bg-[#7B3F30]"
          />
        </div>
      </form>
    </div>
  );
}