"use client";
import { useState } from "react";
import { useFetchUsers } from "../hooks/useFetchUsers";
import RegisterFarmerModal from "./registerFarmer";
import FarmerDetailsModal from "./farmerDetails";
import {
    Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  traps: number;
  location: string;
  devices: string[];
  user_type: "farmer" | "agrovet";
}

export default function FarmersPage() {
  const { users, loading, setUsers, error } = useFetchUsers();
  const [showRegister, setShowRegister] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const farmers: Farmer[] = users.filter((user) => user.user_type === "farmer");

  const filteredUsers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.phone.includes(search)
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const paginatedFarmers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen md:ml-80 pr-10 py-10">
      <h1 className="text-[#7B3F30] text-[30px] font-bold mb-5">
        Farmer's Registration
      </h1>
      <div className="flex justify-between items-center mb-6">

        <input
          className="rounded-full px-10 py-3 border-2 w-90 italic"
          placeholder="Search by name or phone number"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          className="bg-[#7B3F30] text-white py-3 px-6 rounded-md font-semibold flex items-center gap-3 cursor-pointer"
          onClick={() => setShowRegister(true)}
        >
          <p>+ Register</p>
        </button>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <TableContainer component={Paper} className="overflow-x-auto">
        <Table
          className="min-w-[400px] md:min-w-[600px]"
          aria-label="farmers table"
        >
          <TableHead sx={{ backgroundColor: "#7B3F30" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Farmer
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Phone number
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                No. of traps
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Location
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-6">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : paginatedFarmers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-6">
                  No farmers found
                </TableCell>
              </TableRow>
            ) : (
              paginatedFarmers.map((farmer) => (
                <TableRow key={farmer.id} className="hover:bg-[#f1eae7]">
                  <TableCell>{farmer.name}</TableCell>
                  <TableCell>{farmer.phone || "N/A"}</TableCell>
                  <TableCell className="font-bold">
                    {farmer.traps || "N/A"}
                  </TableCell>
                  <TableCell>{farmer.location || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#7B3F30",
                        color: "white",
                        fontWeight: "semibold",
                        textTransform: "none",
                        padding: "4px 16px",
                        borderRadius: "4px",
                        "&:hover": { backgroundColor: "#853a12" },
                      }}
                      onClick={() => setSelectedFarmer(farmer)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <div className="paginations flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-[#7B3F30] text-white px-4 py-2 rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-[#7B3F30] text-white px-4 py-2 rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {showRegister && (
        <RegisterFarmerModal
          onClose={() => setShowRegister(false)}
          onRegister={(newFarmer: Farmer) => {
            setUsers((prev: Farmer[]) => [...prev, newFarmer]);
            setCurrentPage(1);
            setShowRegister(false);
          }}
        />
      )}
      {selectedFarmer && (
        <FarmerDetailsModal
          farmer={selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
        />
      )}
    </div>
  );
}
