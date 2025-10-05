'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useFetchLogin from '../hooks/useFetchLogin';

interface FormData {email: string; password: string;}

export default function Login() {
  const {loading, error, login} = useFetchLogin();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({email: '',password: '',});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({...prev,[name]: value,}))};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formError) return;

    const loginData = {id: 0, email: formData.email,password: formData.password,};
    const result = await login(loginData);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/home');
      }, 0);
    } else {
      setSuccess(false);
    }};

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-[url('/images/ourimage.jpg')] bg-cover bg-center relative flex items-center justify-center">
        <div className="absolute inset-0 bg-yellow-950/50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-8xl text-white mb-4 font-bold text-left">Log In</h1>
          <h2 className="text-6xl text-orange-400 font-bold text-left">FruitGuard</h2>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
        <Image src="/images/Group 239208.png" alt="FruitGuard Logo" width={100} height={64} className="mx-auto mb-10" priority/>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xl font-bold mb-1">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email"
                className="w-full p-2 border rounded disabled:opacity-50"
                disabled={loading}
                aria-required="true"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-xl font-bold mb-1">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-2 border rounded pr-10 disabled:opacity-50"
                  disabled={loading}
                  aria-required="true"/>
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
             {formError && <p className="text-red-500 text-xl">{formError}</p>}
            {success && <p className="text-yellow-950 text-xl">Logged in Successfully, redirecting...</p>}
            <button
              type="submit"
              className="w-full bg-yellow-950 text-white p-2 rounded font-bold hover:bg-yellow-800 disabled:opacity-50 cursor-pointer text-xl"
              disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}