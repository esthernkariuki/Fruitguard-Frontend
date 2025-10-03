"use client";
import { useState } from "react";
import { useFetchAgrovets } from "../hooks/useFetchAgrovets";
import { useFetchDevices } from "../hooks/useFetchDevices";
import { Agrovet } from "../utils/type";
import { Card } from "../utils/type";
import { PaginationControlsProps } from "../utils/type";
import { FiSearch } from "react-icons/fi";

export default function HomePage() {
  const { agrovets, agrovetsCount, loading: agrovetsLoading, error: agrovetsError } = useFetchAgrovets();
  const { trapsCount, loading: devicesLoading, error: devicesError } = useFetchDevices();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const loading = agrovetsLoading || devicesLoading;
  const error = agrovetsError || devicesError;

  const filteredAgrovets = agrovets.filter((m: Agrovet) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgrovets.length / itemsPerPage) || 1;

  const currentAgrovets = filteredAgrovets.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );


  return (
    <div className="min-h-screen bg-[#f9f6f3] flex flex-row font-sans text-black">
 
      <aside className="hidden md:flex flex-col w-[260px] min-h-screen bg-[#763B18] text-white px-5 py-8 items-center gap-6">

        <div className="flex flex-col items-center gap-2">
          <div className="bg-[#FFC661] rounded-full w-24 h-24 flex items-center justify-center mb-2">
     
          </div>
          <span className="text-2xl font-bold text-[#FFC661]">FruitGuard</span>
        </div>

       
      </aside>

      <main className="flex-1 w-full px-4 sm:px-6 md:px-12 lg:px-24 xl:px-36 ">
        <h1 className="text-3xl md:text-4xl font-semibold mb-5 mt-5">Home</h1>
  
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 mb-12">
          <StatCard count={trapsCount} label="Total traps" />
          <StatCard count={agrovetsCount} label="Number of agrovets" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold mb-3">Agrovet managers</h2>
    
        <div className="relative flex items-center w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-10 py-2 w-full text-black bg-white shadow-sm"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-[#763B18] text-white">
                <th className="py-4 px-4 text-left font-bold rounded-tl-2xl border border-[#763B18]">Id</th>
                <th className="py-4 px-4 text-left font-bold border-y border-[#763B18]">Name</th>
                <th className="py-4 px-4 text-left font-bold border-y border-[#763B18]">Location</th>
                <th className="py-4 px-4 text-left font-bold rounded-tr-2xl border border-[#763B18]">Phone No</th>
              </tr>
            </thead>
            {filteredAgrovets.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center py-10 text-lg text-gray-600 border border-t-0 border-b-0 border-x-0 bg-[#FFF9E6]">
                    No agrovet manager found with that name.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="bg-white">
                {currentAgrovets.map((m: Agrovet, idx) => (
                  <tr key={m.id} className={idx % 2 === 0 ? "bg-[#FFF9E6]" : ""}>
                    <td className="py-4 px-4 border border-gray-300">{m.id}</td>
                    <td className="py-4 px-4 border border-gray-300">{m.name}</td>
                    <td className="py-4 px-4 border border-gray-300">{m.location}</td>
                    <td className="py-4 px-4 border border-gray-300">{m.phone}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
 
        <PaginationControls currentPage={page} totalPages={totalPages} setCurrentPage={setPage} />
      </main>
    </div>
  );
}



function StatCard({ count, label }: Card) {

  return (
    <div className="bg-[#FFC661] rounded-xl flex-1 min-w-[260px] max-w-md px-6 py-10 shadow-md text-center flex flex-col items-center justify-center transition hover:scale-[1.03]">
      <div className="text-4xl md:text-5xl font-bold">{count}</div>
      <div className="text-lg md:text-xl mt-2 font-medium">{label}</div>
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, setCurrentPage }: PaginationControlsProps) {
  return (
    <div className=" flex items-center justify-center gap-4 text-black py-5 ">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-5 py-2 rounded-lg font-bold text-base transition ${
          currentPage === 1
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-[#763B18] text-white cursor-pointer hover:bg-[#94502c]"
        }`}
      >
        Previous
      </button>
      <span className="font-bold text-[#763B18] text-base">
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-5 py-2 rounded-lg font-bold text-base transition ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-[#763B18] text-white cursor-pointer hover:bg-[#94502c]"
        }`}
      >
        Next
      </button>
    </div>
  );
}

