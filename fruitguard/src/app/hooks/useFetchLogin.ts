'use client';

import { useState } from 'react';
import { fetchLogin } from '../utils/fetchLogin';

interface UserType {id: number; email: string; password: string;}
const useFetchLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: UserType) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLogin(userData);
      if (!result) {
        throw new Error('Login failed');
      }
      return result;
    } catch (error) {
      setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }};
  return { login, loading, error };
};
export default useFetchLogin;
