import { useEffect, useState } from "react";
import { fetchAgrovets } from "../utils/fetchAgrovets";
import { Agrovet } from "../utils/type";

export function useFetchAgrovets() {
  const [agrovets, setAgrovets] = useState<Agrovet[]>([]);
  const [agrovetsCount, setAgrovetsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response: Agrovet[] = await fetchAgrovets();

        const mappedAgrovets = response.map((agrovet) => ({
          ...agrovet,
          name: `${agrovet.first_name} ${agrovet.last_name}`,
          phone: agrovet.phone_number,
          traps: agrovet.number_of_traps,
          devices: agrovet.devices || [],
        }));

        setAgrovets(mappedAgrovets);
        setAgrovetsCount(response.length);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { agrovets, agrovetsCount, loading, error, setAgrovets };
}
