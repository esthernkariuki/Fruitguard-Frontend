import { useEffect, useState } from "react";
import { fetchFarmers } from "../utils/fetchFarmers";
import { Farmer } from "../utils/types";

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
