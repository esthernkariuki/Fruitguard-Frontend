"use client";
import Button from "../sharedComponents/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/outline";

export default function Roles() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-4xl text-center">
        <div className="relative mb-12 mt-16 sm:mt-24 md:-mt-50">
          <div className="flex justify-center">
            <Image
              src="/Images/fruitguard.png"
              alt="FruitGuard logo"
              width={150}
              height={80}
              className="max-w-full h-auto"
            />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#683929] mb-5 -mt-12">
          Welcome to FruitGuard
        </h2>

        <p className="text-lg sm:text-xl md:text-2xl mx-auto mb-12 px-2 max-w-3xl leading-relaxed">
          An intelligent platform to monitor traps. Please select your role to continue.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center items-center">
          <Button
            buttonText="Agrovet"
            variant="secondary"
            onClickHandler={() => router.push("/Register?role=agrovet")}
            icon={<UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
            className="flex items-center gap-2 sm:gap-3 font-semibold border-2 hover:bg-[#683929] hover:text-white text-lg sm:text-xl py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-colors duration-300 w-full sm:w-auto"
          />

          <Button
            buttonText="Admin"
            variant="secondary"
            onClickHandler={() => router.push("/Login?role=admin")}
            icon={<UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
            className="flex items-center gap-2 sm:gap-3 font-semibold border-2 hover:bg-[#683929] hover:text-white text-lg sm:text-xl py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-colors duration-300 w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}