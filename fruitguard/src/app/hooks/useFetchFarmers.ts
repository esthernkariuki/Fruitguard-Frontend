import { useEffect, useState } from "react";
import { fetchFarmers } from "../utils/fetchFarmers";
import { Farmer } from "../utils/types";

export function useFetchFarmers() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
    setLoading(true);
    setError(null);
    try{
      const data = await fetchFarmers();
        if (!data) {throw new Error("Failed to fetch farmers");}
        setFarmers(data);}
    catch(error) {
        setError((error as Error).message);}
    finally {
        setLoading(false);
      }
    };
    fetchData();},[]);
 return { farmers, loading, error };
}

