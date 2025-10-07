"use client";
import { useState } from "react";
import { useFetchAgrovets } from "../hooks/useFetchAgrovets";
import { useFetchDevices } from "../hooks/useFetchDevices";
import { Agrovet } from "../utils/type";
import { Card } from "../utils/type";
import { PaginationControlsProps } from "../utils/type";
import { FiSearch } from "react-icons/fi";
import AdminLayout from "../sharedComponents/AdminLayout";

export default function HomePage() {
  const { agrovets, agrovetsCount } = useFetchAgrovets();
  const { trapsCount } = useFetchDevices();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const filteredAgrovets = agrovets.filter((m: Agrovet) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgrovets.length / itemsPerPage) || 1;
  const currentAgrovets = filteredAgrovets.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="flex min-h-screen">
        <main className="flex-1 p-4 lg:p-5 xl:p-6 bg-[#f9f6f3] font-nunito text-black ml-[18rem]">
          <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px]">
            <h1 className="text-[#683929] text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold mb-4 mt-2">
              Home
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6 justify-items-center">
              <StatCard count={trapsCount} label="Total traps" />
              <StatCard count={agrovetsCount} label="Number of agrovets" />
            </div>

            <h2 className="text-[#683929] text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold mb-4 mt-2">
              Agrovet managers
            </h2>

            <div className="w-full max-w-md  mb-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-black bg-white shadow-sm text-sm lg:text-base"
                />
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-300 mb-6">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-[#683929] text-white font-semibold">
                    <th className="p-2 lg:p-2.5 xl:p-3 2xl:p-4 text-left font-bold rounded-tl-2xl border border-[#763B18] break-words text-xs lg:text-sm xl:text-base min-w-[80px] lg:min-w-[100px]">
                      Id
                    </th>
                    <th className="p-2 lg:p-2.5 xl:p-3 2xl:p-4 text-left font-bold border-y border-[#763B18] break-words text-xs lg:text-sm xl:text-base min-w-[120px] lg:min-w-[160px]">
                      Name
                    </th>
                    <th className="p-2 lg:p-2.5 xl:p-3 2xl:p-4 text-left font-bold border-y border-[#763B18] break-words text-xs lg:text-sm xl:text-base min-w-[120px] lg:min-w-[180px]">
                      Location
                    </th>
                    <th className="p-2 lg:p-2.5 xl:p-3 2xl:p-4 text-left font-bold rounded-tr-2xl border border-[#763B18] break-words text-xs lg:text-sm xl:text-base min-w-[120px] lg:min-w-[160px]">
                      Phone No
                    </th>
                  </tr>
                </thead>
                {filteredAgrovets.length === 0 ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 lg:py-8 text-sm lg:text-base text-gray-600 bg-[#FFF9E6] rounded-b-2xl"
                      >
                        No agrovet manager found with that name.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {currentAgrovets.map((m: Agrovet, idx) => (
                      <tr
                        key={m.id}
                        className={idx % 2 === 0 ? "bg-[#FFF9E6]" : "bg-white"}
                      >
                        <td className="p-2 lg:p-2.5 xl:p-3 2xl:p-4 border border-gray-300 text-xs lg:text-sm xl:text-base break-words">
                          {m.id}
                        </td>
                        <td className="p-2 lg:p-2.5 xl:p-3 2xl:p-4 border border-gray-300 text-xs lg:text-sm xl:text-base break-words">
                          {m.name}
                        </td>
                        <td className="p-2 lg:p-2.5 xl:p-3 2xl:p-4 border border-gray-300 text-xs lg:text-sm xl:text-base break-words">
                          {m.location}
                        </td>
                        <td className="p-2 lg:p-2.5 xl:p-3 2xl:p-4 border border-gray-300 text-xs lg:text-sm xl:text-base break-words">
                          {m.phone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              setCurrentPage={setPage}
            />
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}

function StatCard({ count, label }: Card) {
  return (
    <div className="bg-[#FFC661] rounded-xl w-full max-w-[500px] px-6 py-7 sm:px-8 sm:py-9 shadow-md text-center flex flex-col items-center justify-center transition hover:scale-[1.02]">
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold">{count}</div>
      <div className="text-base sm:text-lg md:text-xl mt-2 font-medium">{label}</div>
    </div>
  );
}
function PaginationControls({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-2 lg:gap-3 py-2 lg:py-3 flex-wrap">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-bold text-xs sm:text-sm lg:text-base transition ${
          currentPage === 1
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-[#683929] text-white cursor-pointer hover:bg-[#94502c]"
        }`}
      >
        Previous
      </button>
      <span className="font-bold text-[#683929] text-xs sm:text-sm lg:text-base whitespace-nowrap">
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-bold text-xs sm:text-sm lg:text-base transition ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-[#683929] text-white cursor-pointer hover:bg-[#94502c]"
        }`}
      >
        Next
      </button>
    </div>
  );
}