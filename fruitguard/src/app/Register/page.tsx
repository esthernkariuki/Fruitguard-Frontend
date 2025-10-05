'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useFetchRegister from '../hooks/useFetchRegister';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { loading, error, register } = useFetchRegister();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => {
      const updated: FormData = { ...prev, [name]: value };
      if (name === 'password' || name === 'confirmPassword') {
        if (updated.password && updated.confirmPassword && updated.password !== updated.confirmPassword) {
          setFormError('Passwords do not match.');
        } else {
          setFormError(null);
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formError) return;

    const userData = {
      id: 0,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    const result = await register(userData);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/Login');
      }, 0);
    } else {
      setSuccess(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-[url('/images/ourimage.jpg')] bg-cover bg-center relative flex items-center justify-center">
        <div className="absolute inset-0 bg-yellow-950/50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-8xl text-white mb-4 font-bold">Sign Up</h1>
          <h2 className="text-6xl text-orange-400 font-bold text-left">FruitGuard</h2>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <Image src="/images/Group 239208.png" alt="FruitGuard Logo" width={100} height={64} className="mx-auto mb-10" priority />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold mb-1 text-xl">First Name</label>
              <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name"
                className="w-full p-2 border rounded disabled:opacity-50"
                disabled={loading}
                aria-required="true" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-bold mb-1 text-xl">Last Name</label>
              <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name"
                className="w-full p-2 border rounded disabled:opacity-50"
                disabled={loading}
                aria-required="true" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1 text-xl">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email"
                className="w-full p-2 border rounded disabled:opacity-50"
                disabled={loading}
                aria-required="true" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-1 text-xl">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-2 border rounded pr-10 disabled:opacity-50"
                  disabled={loading}
                  aria-required="true" />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold mb-1 text-xl">Confirm Password</label>
              <div className="relative">
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full p-2 border rounded pr-10 disabled:opacity-50"
                  disabled={loading}
                  aria-required="true" />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            {(formError) && (<p className="text-red-500 text-xl">{formError}</p>)}
            {success && (<p className="text-yellow-950 text-xl">Successfully signed up, redirecting...</p>)}
            <button type="submit"
              className="w-full bg-yellow-950 text-white p-2 rounded font-bold hover:bg-yellow-800 disabled:opacity-50 cursor-pointer text-xl"
              disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-left text-xl">Already have an account?{' '}
            <Link href="/Login" className="text-yellow-950 font-bold hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  )
};