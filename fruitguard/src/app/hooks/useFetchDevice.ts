import { useEffect, useState } from "react";
import { fetchDevices } from "../utils/fetchDevice";

export interface Device {
  device_id: number;
  device_identifier: string;
  status: string;
  created_at: string;
  user_id: number;
}

export function useFetchDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchDevices();
      setDevices(response);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { devices, loading, error, refetch: fetchData };
}