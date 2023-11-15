import { useEffect, useState } from "react";
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input } from "@nextui-org/react";
import CustomFooter from "../components/Footer";
import Swal from "sweetalert2";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";

export default function PembatalanPageAdmin() {
  const [search, setSearch] = useState("");
  const [pembatalanData, setPembatalanData] = useState([]);

  const fetchPembatalanData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("http://127.0.0.1:8000/api/getPembatalanGrup", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setPembatalanData(result.data);
    } catch (error) {
      console.error("Error fetching pembatalan data: ", error);
    }
  };

  useEffect(() => {
    fetchPembatalanData();
  }, []);

  const handleBatalClick = (id_reservasi) => {
        cancelReservation(id_reservasi);
  };

  const cancelReservation = async (id_reservasi) => {
    try {
      const authToken = localStorage.getItem("authToken");
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Batalkan!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.showLoading();
  
          const response = await fetch(`http://127.0.0.1:8000/api/reservasi/${id_reservasi}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const result = await response.json();
          if (result.status === 'success') {
            fetchPembatalanData();
            Swal.fire({
              icon: 'success',
              title: 'Reservasi Cancelled Successfully',
              text: result.message,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error Cancelling Reservasi',
              text: 'Please try again.',
            });
          }
        }
      });
    } catch (error) {
      console.error("Error cancelling reservasi: ", error);
    }
  };
  

  return (
    <>
      <NavbarLoginAdmin />
      <Card className="px-10 py-10">
        <div className="container mx-auto py-10">
          <Input
            className="w-60"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Table className="py-10">
            <TableHeader>
              <TableColumn>Nama Customer</TableColumn>
              <TableColumn>ID Booking</TableColumn>
              <TableColumn>Tanggal Reservasi</TableColumn>
              <TableColumn>Tanggal Mulai</TableColumn>
              <TableColumn>Tanggal Selesai</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {pembatalanData
                .filter((pembatalan) => {
                  const lowerCaseSearch = search.trim().toLowerCase();
                  return (
                    pembatalan.id_booking.toLowerCase().includes(lowerCaseSearch) ||
                    pembatalan.tanggal_reservasi.toLowerCase().includes(lowerCaseSearch) ||
                    pembatalan.customer.nama.toLowerCase().includes(lowerCaseSearch)
                  );
                })
                .map((pembatalan) => (
                  <TableRow key={pembatalan.id_reservasi}>
                    <TableCell>{pembatalan.customer.nama}</TableCell>
                    <TableCell>{pembatalan.id_booking}</TableCell>
                    <TableCell>{pembatalan.tanggal_reservasi}</TableCell>
                    <TableCell>{pembatalan.tanggal_mulai}</TableCell>
                    <TableCell>{pembatalan.tanggal_selesai}</TableCell>
                    <TableCell>{pembatalan.status}</TableCell>
                    <TableCell>
                      <Button
                        color="danger"
                        variant="flat"
                        onClick={() => handleBatalClick(pembatalan.id_reservasi)}
                      >
                        Batal
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      <CustomFooter />
    </>
  );
}
