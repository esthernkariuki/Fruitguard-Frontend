import { useEffect, useState } from "react";
import { fetchProfile } from "../utils/fetchProfile";
import { Profile } from "../utils/types";


export default function useProfile(token: string) {
  const [profile, setProfile] = useState<Profile |null >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token is missing");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProfile(token)
      .then(setProfile)
      .catch(err => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [token]);

  return { profile, loading, error };
}


