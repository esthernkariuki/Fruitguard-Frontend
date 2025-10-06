"use client";
import { useState } from "react";
import { useFetchUsers } from "../../../hooks/useFetchUsers";
import Button from "../../../sharedComponents/Button";
import FarmerDetailsModal from "../FarmerDetails";
import RegisterFarmerModal from "../FarmerRegistration";
import { FaSearch, FaPlus } from "react-icons/fa";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Snackbar, Alert } from "@mui/material";
import { UserType } from "../../../utils/types/users";

export default function FarmersPage() {
  const { users, loading, error, refetch } = useFetchUsers();
  const [showRegister, setShowRegister] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<UserType | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });
  const pageSize = 8;

  const farmers: UserType[] = users
    .filter((user) => user.user_type === "farmer")
    .sort((a, b) => b.id - a.id);

  const filteredUsers = farmers.filter(
    (f) =>
      `${f.first_name} ${f.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      f.phone_number.includes(search)
  );

  const paginatedFarmers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleRegisterFarmer = () => {
    refetch();
    setCurrentPage(1);
    setShowRegister(false);
  };

  const handleSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="min-h-screen md:ml-80 pr-10 py-10">
      <h1 className="text-[#7B3F30] text-[30px] font-bold mb-5">Farmer&apos;s Registration</h1>
      <div className="flex justify-between mb-6">
        <div className="relative w-90">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7B3F30]" />
          <input
            className="pl-10 pr-10 py-3 border-2 w-full italic"
            placeholder="Search by name or phone number"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search farmers by name or phone number"
          />
        </div>

        <Button
          buttonText="Register"
          variant="default"
          onClickHandler={() => setShowRegister(true)}
          icon={<FaPlus size={16} />}
          className="py-3 px-6 rounded-md font-semibold"
        />
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <TableContainer component={Paper} className="overflow-x-auto">
        <Table className="min-w-[400px] md:min-w-[600px]" aria-label="farmers table">
          <TableHead sx={{ backgroundColor: "#7B3F30" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>Farmer</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>Phone number</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>No. of traps</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>Location</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-6" sx={{ fontSize: "16px" }}>
                  Loading data...
                </TableCell>
              </TableRow>
            ) : paginatedFarmers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-6" sx={{ fontSize: "16px" }}>
                  No farmers found
                </TableCell>
              </TableRow>
            ) : (
              paginatedFarmers.map((farmer) => (
                <TableRow key={farmer.id} className="hover:bg-[#f1eae7]">
                  <TableCell sx={{ fontSize: "16px" }}>{`${farmer.first_name} ${farmer.last_name}`}</TableCell>
                  <TableCell sx={{ fontSize: "16px" }}>{farmer.phone_number || "N/A"}</TableCell>
                  <TableCell className="font-bold" sx={{ fontSize: "16px" }}>
                    {farmer.number_of_traps || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "16px" }}>{farmer.location || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      buttonText="View"
                      variant="default"
                      onClickHandler={() => setSelectedFarmer(farmer)}
                      className="py-3 px-5 rounded font-semibold hover:bg-[#853a12] hover:text-white"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <div className="paginations flex justify-center items-center gap-4 mt-4">
          <Button
            buttonText="Previous"
            variant="default"
            onClickHandler={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 rounded font-semibold ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "hover:bg-[#853a12]"}`}
            disabled={currentPage === 1}
          />
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            buttonText="Next"
            variant="default"
            onClickHandler={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={`px-4 py-2 rounded font-semibold ${
              currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "hover:bg-[#853a12]"
            }`}
            disabled={currentPage === totalPages}
          />
        </div>
      )}

      {showRegister && (
        <RegisterFarmerModal
          open={showRegister}
          onClose={() => setShowRegister(false)}
          onRegister={handleRegisterFarmer}
          onSnackbar={handleSnackbar}
        />
      )}
      {selectedFarmer && <FarmerDetailsModal farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)} />}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{ zIndex: 1400 }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            backgroundColor: snackbar.severity === "success" ? "#0F5736" : undefined,
            color: "white",
            "& .MuiAlert-icon": { color: "white" },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
