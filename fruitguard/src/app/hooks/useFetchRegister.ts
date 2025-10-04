'use client';

import { useState } from 'react';
import { fetchRegister } from '../utils/fetchRegister';

interface UserType {id: number, firstName: string; lastName: string; email: string; password: string;}
const useFetchRegister = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: UserType) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRegister(userData);
      if (!result) {
        throw new Error('Registration failed');
      }
      return result;
    } catch (error) {
      setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }};
  return { register, loading, error };
};
export default useFetchRegister;
