
"use client";
import { useState } from "react";
import { useFetchAgrovets } from "../hooks/useFetchAgrovets";
import { useFetchDevices } from "../hooks/useFetchDevices";
import { Agrovet } from "../utils/type";
import { Card } from "../utils/type";
import { PaginationControlsProps } from "../utils/type";

export default function HomePage() {
  const { agrovets, agrovetsCount, loading: agrovetsLoading, error: agrovetsError } = useFetchAgrovets();
  const { trapsCount, loading: devicesLoading, error: devicesError } = useFetchDevices();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-black">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-start px-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f6f3] flex flex-col items-center pt-4 font-sans text-black">
      <div className="w-full max-w-[95rem] px-4">
        <h1 className="text-4xl font-semibold mb-10 ml-35">Home</h1>
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <StatCard count={trapsCount} label="Total active Traps" />
          <StatCard count={agrovetsCount} label="Number of agrovet" />
        </div>

        <h2 className="text-2xl font-semibold mb-3 ml-30">Agrovet managers</h2>

        <div className="flex justify-end mt-5 gap-2 ml-30 w-80">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-4 py-2 max-w-md flex-grow text-black"
          />
        </div>

        <div className="overflow-x-auto w-[80%] flex justify-end ml-30 mt-10">
          <table className="min-w-[1200px] border border-gray-300 rounded-lg border-collapse text-black">
            <thead className="bg-[#763B18] text-white">
              <tr>
                <th className="py-2 px-4 border-r border-gray-400 text-left font-bold">Id</th>
                <th className="py-2 px-4 border-r border-gray-400 text-left font-bold">Name</th>
                <th className="py-2 px-4 border-r border-gray-400 text-left font-bold">Location</th>
                <th className="py-2 px-4 text-left font-bold">Phone No</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentAgrovets.map((m: Agrovet) => (
                <tr key={m.id}>
                  <td className="py-2 px-4 border-r border-gray-200">{m.id}</td>
                  <td className="py-2 px-4 border-r border-gray-200">{m.name}</td>
                  <td className="py-2 px-4 border-r border-gray-200">{m.location}</td>
                  <td className="py-2 px-4">{m.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls currentPage={page} totalPages={totalPages} setCurrentPage={setPage} />
      </div>
    </div>
  );
}


function StatCard({ count, label }: Card) {
  return (
    <div className="bg-[#C89D7C] rounded-xl p-8 w-80 shadow-md text-center">
      <div className="text-4xl font-bold">{count}</div>
      <div className="text-lg mt-1">{label}</div>
    </div>
  );
}


function PaginationControls({ currentPage, totalPages, setCurrentPage }: PaginationControlsProps) {
  const brown = "#763B18";
  const disabledBg = "#E0E0E0";
  const disabledColor = "#888";

  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        color: "black",
      }}
    >
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          backgroundColor: currentPage === 1 ? disabledBg : brown,
          color: currentPage === 1 ? disabledColor : "white",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          padding: "6px 18px",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          transition: "background 0.2s",
        }}
      >
        Previous
      </button>
      <span style={{ fontWeight: "bold", color: brown }}>
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          backgroundColor: currentPage === totalPages ? disabledBg : brown,
          color: currentPage === totalPages ? disabledColor : "white",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          padding: "6px 18px",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          transition: "background 0.2s",
        }}
      >
        Next
      </button>
    </div>
  );
}
