import { Farmer } from "../hooks/useFetchUsers";
import { useState, useEffect } from "react";
import AddDeviceModal from "./addDevice";
import { useFetchDevices } from "../hooks/useFetchDevice";
import { useFetchUsers } from "../hooks/useFetchUsers"; 

interface Props {
  farmer: Farmer;
  onClose: () => void;
}

export default function FarmerDetailsModal({ farmer, onClose }: Props) {
  const [showAddDevice, setShowAddDevice] = useState(false);
  const { devices, loading, error, refetch: refetchDevices } = useFetchDevices();
  const { refetch: refetchUsers } = useFetchUsers(); 

  
  const farmerDevices = devices.filter((device) => device.user_id === parseInt(farmer.id, 10));

  const handleAddDevice = (newDevice: Device) => {
    refetchDevices(); 
    setShowAddDevice(false);
  };

  return (
    <div className="fixed inset-0 bg-[#7B3F30]/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-10 w-[500px] flex flex-col gap-4">
        <h2 className="text-[#7B3F30] text-xl font-bold mb-2">Farmer details</h2>
        <div className="text-lg">
          <div className="font-semibold">{farmer.name}</div>
          <div>{farmer.phone}</div>
          <div>{farmer.location}</div>
        </div>
        <div>
          <h3 className="font-bold text-[#7B3F30] mt-4 mb-2">Registered devices</h3>
          {loading ? (
            <p>Loading devices...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {farmerDevices.length ? (
                farmerDevices.map((device) => (
                  <li key={device.device_id} className="text-gray-700">
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
          <button
            type="button"
            className="bg-[#FDF6EC] text-[#7B3F30] px-4 py-0 rounded font-semibold border border-black"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-[#7B3F30] text-white px-6 py-2 rounded font-semibold mt-4"
            onClick={() => setShowAddDevice(true)}
          >
            Add device
          </button>
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