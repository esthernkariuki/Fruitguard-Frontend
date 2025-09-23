import { useEffect, useState } from "react";
import { fetchDevices } from "../utils/fetchDevices";
import { Device } from "../utils/type";

export function useFetchDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [trapsCount, setTrapsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response: Device[] = await fetchDevices();
        setDevices(response);
        setTrapsCount(response.length);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { devices, trapsCount, loading, error };
}
