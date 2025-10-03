"use client";
import React, { useState } from "react";
import { useFetchFarmers } from "../hooks/useFetchFarmers";
import { FaSearch } from "react-icons/fa";
import AdminLayout from "../sharedComponents/AdminLayout";
import { Farmer } from "../utils/types";

export default function Team() {
  const { farmers, loading, error } = useFetchFarmers();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  function capitalizeWords(str: string) {
    return str.split(" ").map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : "")).join(" ");}

  const filteredFarmers = search? farmers.filter((farmer: Farmer) => {
      const fullName = `${farmer.first_name} ${farmer.last_name}`.toLowerCase();
      const location = (farmer.location ?? "").toLowerCase();
      const phone = farmer.phone_number ?? "";
      const lowerSearch = search.toLowerCase();
      return fullName.includes(lowerSearch) || location.includes(lowerSearch) || phone.includes(lowerSearch); }): farmers;

  const paginatedFarmers = (filteredFarmers ?? []).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil((filteredFarmers ?? []).length / PAGE_SIZE);

  return (
    <AdminLayout>
    <div className="flex min-h-screen">
      <main className="flex-1 p-4 lg:p-5 xl:p-6 bg-white font-nunito ml-[18rem]">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px]">
          <h1 className="text-[#683929] text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold mb-4 mt-2">Registered Farmers</h1>
          <div className="flex justify-end mb-4">
            <div className="relative w-56 lg:w-64 xl:w-80 2xl:w-96 text-[#683929] flex items-center">
              <div className="relative flex items-center w-full max-w-md mb-6">
               <input type="text" placeholder="Search by name,location,phone number" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1);}}
                className="border border-gray-700 rounded-lg px-10 py-2 w-full text-[#683929] bg-white shadow-sm" />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 pointer-events-none" size={20} />
            </div>
            </div> 
          </div>
          {loading ? (
            <div className="text-center p-4 text-sm lg:text-base xl:text-base 2xl:text-lg">Loading...</div>) : error ? (
            <div className="text-red-600 p-4 text-sm lg:text-base xl:text-base 2xl:text-lg" >Error: {error}</div>) : (
            <div className="overflow-x-auto rounded-lg shadow-lg border border-[#683929] mt-4">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-[#683929] text-white">
                    <th scope="col" className="p-2 lg:p-2 xl:p-3 2xl:p-4 border border-[#683929] text-center align-middle text-sm lg:text-base xl:text-base 2xl:text-xl uppercase tracking-wider font-semibold leading-tight min-w-[120px] lg:min-w-[140px] xl:min-w-[160px] 2xl:min-w-[200px]">Farmer</th>
                    <th scope="col" className="p-2 lg:p-2 xl:p-3 2xl:p-4 border border-[#683929] text-center align-middle text-sm lg:text-base xl:text-base 2xl:text-xl uppercase tracking-wider font-semibold leading-tight min-w-[80px] lg:min-w-[100px] xl:min-w-[120px] 2xl:min-w-[160px]"> No. of Devices</th>
                    <th scope="col" className="p-2 lg:p-2 xl:p-3 2xl:p-4 border border-[#683929] text-center align-middle text-sm lg:text-base xl:text-base 2xl:text-xl uppercase tracking-wider font-semibold leading-tight min-w-[100px] lg:min-w-[120px] xl:min-w-[140px] 2xl:min-w-[180px]">Location</th>
                    <th scope="col" className="p-2 lg:p-2 xl:p-3 2xl:p-4 border border-[#683929] text-center align-middle text-sm lg:text-base xl:text-base 2xl:text-xl uppercase tracking-wider font-semibold leading-tight min-w-[100px] lg:min-w-[120px] xl:min-w-[140px] 2xl:min-w-[180px]">Phone No</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFarmers.map((user: Farmer, idx: number) => (
                    <tr key={user.id ?? idx}>
                      <td className="p-2 lg:p-2 xl:p-3 2xl:p-4 border border-[#683929] text-black text-sm lg:text-base xl:text-base 2xl:text-xl leading-tight">{capitalizeWords(user.first_name)} {capitalizeWords(user.last_name)}</td>
                      <td className="p-2 lg:p-2 xl:p-3 2xl:p-4 border border-[#683929] text-center align-middle text-black text-sm lg:text-base xl:text-base 2xl:text-xl leading-tight">{user.number_of_traps ?? "-"}</td>
                      <td className="p-2 lg:p-2 xl:p-3 2xl:p-4 border border-[#683929] text-black text-sm lg:text-base xl:text-base 2xl:text-xl leading-tight">{capitalizeWords(user.location ?? "-")}</td>
                      <td className="p-2 lg:p-2 xl:p-3 2xl:p-4 border border-[#683929] text-black text-sm lg:text-base xl:text-base 2xl:text-xl leading-tight">{user.phone_number ?? "-"}</td>
                    </tr>))}
                </tbody>
              </table>
              {paginatedFarmers.length === 0 && (
                <div className="text-center p-4 text-[#683929] text-sm lg:text-base xl:text-base 2xl:text-lg">No farmers found.</div>)}
            </div> )}
          <div className="pagination-controls mt-4 flex items-center justify-center gap-3">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className={`px-3 py-1 lg:py-1.5 xl:py-1.5 2xl:py-2 rounded border-0 font-bold text-sm lg:text-base xl:text-base 2xl:text-lg ${currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed": "bg-[#683929] text-white cursor-pointer hover:bg-[#5a2b0f]"}`} aria-label="Previous page">Previous</button>
            <span className="font-bold text-sm lg:text-base xl:text-base 2xl:text-lg">Page {currentPage} of {totalPages || 1}</span>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`px-3 py-1 lg:py-1.5 xl:py-1.5 2xl:py-2 rounded border-0 font-bold text-sm lg:text-base xl:text-base 2xl:text-lg ${currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed": "bg-[#683929] text-white cursor-pointer hover:bg-[#5a2b0f]"}`}aria-label="Next page">Next</button>
          </div>
        </div>
      </main>
    </div>
    </AdminLayout>
  );
}