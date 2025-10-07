import { Suspense } from 'react';
import SignInForm from './login';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-[url('/images/ourimage.jpg')] bg-cover bg-center relative flex items-center justify-center">
        <div className="absolute inset-0 bg-yellow-950/50"></div>
        <div className="relative z-10 text-left px-16">
          <h1 className="text-8xl text-white mb-4 font-bold">Log In</h1>
          <h2 className="text-6xl text-orange-400 font-bold">FruitGuard</h2>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
        
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}