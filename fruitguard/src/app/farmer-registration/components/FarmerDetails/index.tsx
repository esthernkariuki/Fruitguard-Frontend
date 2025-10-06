"use client";
import { useState } from "react";
import { useFetchDevices } from "../../../hooks/useFetchDevice";
import AddDeviceModal from "../AddDevice";
import Button from "../../../sharedComponents/Button";
import { UserType } from "../../../utils/types/users";
import { Devices } from "../../../utils/types/device";

interface Props {
  farmer: UserType;
  onClose: () => void;
}

export default function FarmerDetailsModal({ farmer, onClose }: Props) {
  const [showAddDevice, setShowAddDevice] = useState(false);
  const { devices, loading, error, refetch } = useFetchDevices();

  const farmerDevices = devices.filter((device: Devices) => device.user_id === farmer.id);

  const handleAddDevice = () => {
    refetch();
    setShowAddDevice(false);
  };

  return (
    <div className="fixed inset-0 bg-[#7B3F30]/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-10 w-[500px] flex flex-col gap-4">
        <h2 className="text-[#7B3F30] text-xl font-bold mb-2 text-[20px]">Farmer details</h2>
        <div className="text-[18px]">
          <div className="font-semibold">{`${farmer.first_name} ${farmer.last_name}`}</div>
          <div>{farmer.phone_number}</div>
          <div>{farmer.location}</div>
        </div>
        <div>
          <h3 className="font-bold text-[#7B3F30] mt-4 mb-2 text-[20px]">Registered devices</h3>
          {loading ? (
            <p>Loading devices...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {farmerDevices.length ? (
                farmerDevices.map((device: Devices) => (
                  <li key={device.device_id} className="text-gray-700 text-[18px]">
                    {device.device_identifier} (Status: {device.status})
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No devices registered</li>
              )}
            </ul>
          )}
        </div>
        <div className="flex justify-around">
          <Button
            buttonText="Close"
            variant="secondary"
            onClickHandler={onClose}
            className="px-5 py-2 rounded font-semibold bg-[#FDF6EC] border border-black"
          />
          <Button
            buttonText="Add device"
            variant="default"
            onClickHandler={() => setShowAddDevice(true)}
            className="px-6 py-1 rounded font-semibold bg-[#7B3F30]"
          />
        </div>
      </div>
      {showAddDevice && (
        <AddDeviceModal
          farmerId={farmer.id}
          onClose={() => setShowAddDevice(false)}
          onAddDevice={handleAddDevice}
        />
      )}
    </div>
  );
}