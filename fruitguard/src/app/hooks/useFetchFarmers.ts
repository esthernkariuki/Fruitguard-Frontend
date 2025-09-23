import { useEffect, useState } from "react";
import { fetchFarmers } from "../utils/fetchFarmers";

export interface Farmer {
  id: number;
  first_name: string;
  last_name: string;
  location?: string;
  phone_number?: string;
  number_of_traps?: number;
}

export function useFetchFarmers() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchFarmers()
      .then(setFarmers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { farmers, loading, error };
}
