import { useEffect, useState } from "react";
import { fetchDevices } from "../utils/fetchDevice";
import { Devices } from "../utils/types/device";


export function useFetchDevices() {
  const [devices, setDevices] = useState<Devices[]>([]);
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