// CheckInPageAdmin.js
import { useEffect, useState } from "react";
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input } from "@nextui-org/react";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";
import CustomFooter from "../components/Footer";
import Swal from "sweetalert2";

export default function CheckInPageAdmin() {
    const [search, setSearch] = useState("");
    const [checkInData, setCheckInData] = useState([]);

    const fetchCheckInData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch("https://p3l-be-eric.frederikus.com/api/checkIn", {
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
            setCheckInData(result.data);
        } catch (error) {
            console.error("Error fetching check-in data: ", error);
        }
    };

    useEffect(() => {
        fetchCheckInData();
    }, []);


    const handleCheckClick = (id_reservasi, isCheckIn) => {
        checkReservation(id_reservasi, isCheckIn);
    };

    const checkReservation = async (id_reservasi, isCheckIn) => {
        try {
            const authToken = localStorage.getItem("authToken");
            const status = isCheckIn ? "Check In" : "Check Out";
            const confirmationResult = await Swal.fire({
                title: `Are you sure?`,
                text: `This will mark the reservation as ${status.toLowerCase()}!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, ${status}!`,
            });

            if (confirmationResult.isConfirmed) {
                Swal.showLoading();

                try {
                    const response = await fetch(`https://p3l-be-eric.frederikus.com/api/updateStatus/${id_reservasi}`, {
                        method: "PUT",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${authToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            status,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const result = await response.json();
                    if (result.status === 'success') {
                        fetchCheckInData();
                        Swal.fire({
                            icon: 'success',
                            title: `${status} Successfully`,
                            text: result.message,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: `Error ${status}`,
                            text: 'Please try again.',
                        });
                    }
                } catch (error) {
                    console.error(`Error updating status for ${status}: `, error);
                }
            }
        } catch (error) {
            console.error(`Error ${status.toLowerCase()} reservation: `, error);
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
                            <TableColumn>Check In</TableColumn>
                            <TableColumn>Check Out</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {checkInData
                                .filter((checkIn) => {
                                    const lowerCaseSearch = search.trim().toLowerCase();
                                    return (
                                        checkIn.id_booking.toLowerCase().includes(lowerCaseSearch) ||
                                        checkIn.tanggal_reservasi.toLowerCase().includes(lowerCaseSearch) ||
                                        checkIn.customer.nama.toLowerCase().includes(lowerCaseSearch)
                                    );
                                })
                                .map((checkIn) => (
                                    <TableRow key={checkIn.id_reservasi}>
                                        <TableCell>{checkIn.customer.nama}</TableCell>
                                        <TableCell>{checkIn.id_booking}</TableCell>
                                        <TableCell>{checkIn.tanggal_reservasi}</TableCell>
                                        <TableCell>{checkIn.tanggal_mulai}</TableCell>
                                        <TableCell>{checkIn.tanggal_selesai}</TableCell>
                                        <TableCell>{checkIn.status}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="success"
                                                variant="flat"
                                                onClick={() => handleCheckClick(checkIn.id_reservasi, true)}
                                                disabled={checkIn.status === "Check In" || checkIn.status === "Check Out"}
                                                style={{ opacity: checkIn.status === "Check In" || checkIn.status === "Check Out" ? 0.6 : 1 }}
                                            >
                                                Check In
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                color="warning"
                                                variant="flat"
                                                onClick={() => handleCheckClick(checkIn.id_reservasi, false)}
                                                disabled={checkIn.status === "Check Out"}
                                                style={{ opacity: checkIn.status === "Check Out" ? 0.6 : 1 }}
                                            >
                                                Check Out
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
