export interface UserType {
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

export interface Device {
  device_identifier: string;
  user_id: number;
}