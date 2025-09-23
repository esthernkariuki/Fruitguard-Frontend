// hooks/useFetchUsers.ts
import { useEffect, useState } from "react";
import { fetchUsers } from "../utils/fetchUsers";
import { fetchDevices } from "../utils/fetchDevice";

// Interface for raw API user data
interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string | null;
  profile_image: string | null;
  location: string;
  number_of_traps: string;
  user_type: "farmer" | "agrovet";
  created_at: string;
}

// Interface for device data
interface Device {
  device_identifier: string;
  user_id: number;
}

// Farmer interface with user_type
export interface Farmer {
  id: string;
  name: string;
  phone: string;
  traps: number;
  location: string;
  devices: string[];
  user_type: "farmer" | "agrovet"; 
}

export function useFetchUsers() {
  const [users, setUsers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [usersResponse, devicesResponse] = await Promise.all([
          fetchUsers(), 
          fetchDevices(), 
        ]);

       
        const mappedUsers: Farmer[] = usersResponse.map((user: User) => {
          const userDevices = devicesResponse
            .filter((device: Device) => device.user_id === user.id)
            .map((device: Device) => device.device_identifier);

          return {
            id: user.id.toString(),
            name: `${user.first_name} ${user.last_name}`,
            phone: user.phone_number,
            traps: parseInt(user.number_of_traps, 10) || 0,
            location: user.location,
            devices: userDevices,
            user_type: user.user_type, 
          };
        });
        setUsers(mappedUsers);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { users, loading, setUsers, error };
}