export interface Farmer {
  id: number;
  first_name: string;
  last_name: string;
  location?: string;
  phone_number?: string;
  number_of_traps?: number;
}

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image?: string;
  user_type?: string; 
}
