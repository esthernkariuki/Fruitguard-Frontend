'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useFetchLogin from '../hooks/useFetchLogin';
import Image from 'next/image';


interface FormData {
  email: string;
  password: string;
}

export default function SignInForm() {
  const { loading, error, login } = useFetchLogin();
  const router = useRouter();

  const searchParams = useSearchParams();
  const user_type = searchParams.get('user_type');

  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = await login(formData.email, formData.password);
    if (result) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user_type', result.user_type || user_type || '');
      setSuccess(true);

      if (
        (user_type && user_type.toLowerCase() === 'admin') ||
        (result.user_type && result.user_type.toLowerCase() === 'admin')
      ) {
        router.push('/home');
      } else {
        router.push('/farmer-registration');
      }}};

  return (
    <>
      <Image
        src="/images/Group239208.png"
        alt="FruitGuard Logo"
        width={100}
        height={100}
        className="mx-auto mb-10"
        priority
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xl font-bold mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full p-2 border rounded disabled:opacity-50"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xl font-bold mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full p-2 border rounded pr-10 disabled:opacity-50"
              disabled={loading}
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        {(formError || error) && (
          <p className="text-red-500 text-xl">{formError || error}</p>
        )}
        {success && (
          <p className="text-yellow-950 text-xl">Logged in Successfully, redirecting...</p>
        )}
        <button
          type="submit"
          className="w-full bg-yellow-950 text-white p-2 rounded font-bold hover:bg-yellow-800 disabled:opacity-50 cursor-pointer text-xl"
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </>
  );
}
