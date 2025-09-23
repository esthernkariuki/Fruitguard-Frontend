"use client";
import React, { useState } from "react";
import { useFetchFarmers,Farmer } from "../hooks/useFetchFarmers";
import { FaSearch } from "react-icons/fa";

export default function RegisteredFarmers() {
  const { farmers, loading, error } = useFetchFarmers();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filteredFarmers = search? farmers.filter((farmer: Farmer) => {
        const fullName = `${farmer.first_name} ${farmer.last_name}`.toLowerCase();
        const location = (farmer.location ?? "").toLowerCase();
        const phone = farmer.phone_number ?? "";
        const lowerSearch = search.toLowerCase();
        return (fullName.includes(lowerSearch) || location.includes(lowerSearch) || phone.includes(lowerSearch)); }): farmers;

  const paginatedFarmers = (filteredFarmers ?? []).slice((currentPage - 1) * PAGE_SIZE,currentPage * PAGE_SIZE);
  const totalPages = Math.ceil((filteredFarmers ?? []).length / PAGE_SIZE);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 pt-3 pr-8 pb-8 bg-white font-nunito">
        <div className="w-[80%] ml-70 mt-0">
          <h1 className="text-[#763B18] text-4xl mb-2 font-bold">Registered farmers</h1>
          <div className="flex justify-end mb-4">
            <div className="relative w-64 text-[#763B18] flex items-center">
              <FaSearch className="absolute left-3 text-[#763B18]" />
              <input type="text" placeholder="Search" value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1);}}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-[#763B18] text-[#763B18] text-base placeholder:text-[#763B18]"/>
            </div>
          </div>
          {loading ? (
            <div className="text-center p-8">Loading...</div>) : error ? (
            <div className="text-red-600 p-8">Error: {error}</div>) : (
            <div className="overflow-x-auto rounded-lg shadow-lg border border-[#763B18] mt-10">
              <table className="min-w-full border-collapse table-fixed">
                <thead>
                  <tr className="bg-[#763B18] text-white">
                    <th className="p-3 border border-[#763B18] text-center align-middle text-[1.1rem] uppercase tracking-wider font-semibold">Farmer</th>
                    <th className="p-3 border border-[#763B18] text-center align-middle text-[1.1rem] uppercase tracking-wider font-semibold">No.of.devices</th>
                    <th className="p-3 border border-[#763B18] text-center align-middle text-[1.1rem] uppercase tracking-wider font-semibold">Location</th>
                    <th className="p-3 border border-[#763B18] text-center align-middle text-[1.1rem] uppercase tracking-wider font-semibold">Phone No</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFarmers.map((user: Farmer, idx: number) => (
                    <tr key={user.id ?? idx }>
                      <td className="p-4 border border-[#763B18] text-black text-lg font-semibold">{user.first_name} {user.last_name}</td>
                      <td className="p-4 border border-[#763B18] text-center align-middle text-black text-lg font-semibold">{user.number_of_traps ?? "-"}</td>
                      <td className="p-4 border border-[#763B18] text-black text-lg font-semibold">{user.location ?? "-"}</td>
                      <td className="p-4 border border-[#763B18] text-black text-lg font-semibold">{user.phone_number ?? "-"}</td>
                    </tr> ))}
                </tbody>
              </table>
              {paginatedFarmers.length === 0 && (
                <div className="text-center p-8 text-[#763B18]">No farmers found.</div>)}
          </div>)}

          <div className="pagination-controls mt-6 flex items-center justify-center gap-3">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}className={`px-3 py-1 rounded border-0 font-bold ${
                currentPage === 1? "bg-white text-gray-400 cursor-not-allowed": "bg-[#763B18] text-white cursor-pointer hover:bg-[#5a2b0f]"}`} >Previous</button>
            <span className="font-bold">Page {currentPage} of {totalPages || 1}</span>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} className={`px-3 py-1 rounded border-0 font-bold ${
                currentPage === totalPages || totalPages === 0 ? "bg-gray-300 text-white cursor-not-allowed": "bg-[#763B18] text-white cursor-pointer hover:bg-[#5a2b0f]"}`} >Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}
