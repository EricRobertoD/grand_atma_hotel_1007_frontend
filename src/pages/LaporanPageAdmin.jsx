import { useState, useEffect } from "react";
import { Card, Table, TableHeader, TableColumn, TableBody, TableCell, Modal, ModalContent, ModalHeader, ModalFooter, Button, TableRow, ModalBody } from "@nextui-org/react";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";
import CustomFooter from "../components/Footer";

export default function LaporanPageAdmin() {
    const [dataLaporanCustomerBaru, setDataLaporanCustomerBaru] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataPendapatan, setDataPendapatan] = useState(null);
    const [isModalPendapatan, setIsModalPendapatan] = useState(false);
    const [dataJumlahTamu, setDataJumlahTamu] = useState(null);
    const [isModalJumlahTamu, setIsModalJumlahTamu] = useState(false);
    const [dataTopCustomer, setDataTopCustomer] = useState(null);
    const [isModalTopCustomer, setIsModalTopCustomer] = useState(false);

    const handleButtonTopCustomer = () => {
        setIsModalTopCustomer(true);
    };

    const handleCloseTopCustomer = () => {
        setIsModalTopCustomer(false);
    };

    const handleButtonPendapatan = () => {
        setIsModalPendapatan(true);
    };

    const handleClosePendapatan = () => {
        setIsModalPendapatan(false);
    };

    const handleButtonJumlahTamu = () => {
        setIsModalJumlahTamu(true);
    };

    const handleCloseJumlahTamu = () => {
        setIsModalJumlahTamu(false);
    };

    const fetchNewCustomer = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch("https://p3l-be-eric.frederikus.com/api/getNewCustomer", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDataLaporanCustomerBaru(data);
            } else {
                console.error("Failed to fetch new customer data");
            }
        } catch (error) {
            console.error("Failed to fetch new customer data:", error);
        }
    };

    const fetchPendapatanPerJenisTamuPerBulan = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch("https://p3l-be-eric.frederikus.com/api/getPendapatanPerJenisTamuPerBulan", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const dataPendapatan = await response.json();
                setDataPendapatan(dataPendapatan);
            } else {
                console.error("Failed to fetch new customer data");
            }
        } catch (error) {
            console.error("Failed to fetch new customer data:", error);
        }
    };

    const fetchJumlahTamu = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch("https://p3l-be-eric.frederikus.com/api/getCustomerCountPerRoomType", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const dataJumlahTamu = await response.json();
                setDataJumlahTamu(dataJumlahTamu);
            } else {
                console.error("Failed to fetch new customer data");
            }
        } catch (error) {
            console.error("Failed to fetch new customer data:", error);
        }
    };

    const fetchTopCustomer = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch("https://p3l-be-eric.frederikus.com/api/getTopCustomersWithMostBookings", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const dataTopCustomer = await response.json();
                setDataTopCustomer(dataTopCustomer);
            } else {
                console.error("Failed to fetch new customer data");
            }
        } catch (error) {
            console.error("Failed to fetch new customer data:", error);
        }
    };

    useEffect(() => {
        fetchNewCustomer();
        fetchPendapatanPerJenisTamuPerBulan();
        fetchJumlahTamu();
        fetchTopCustomer();
    }, []);

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <NavbarLoginAdmin />

            <Card className="px-10 py-10">
                <div className="container mx-auto py-10">
                    <Table>
                        <TableHeader>
                            <TableColumn>Laporan</TableColumn>
                            <TableColumn>Laporan</TableColumn>
                            <TableColumn>Chart</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>Laporan Get Customer</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={handleButtonClick}>
                                        Laporan
                                    </Button>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>Laporan Jenis Customer per Bulan</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={handleButtonPendapatan}>
                                        Laporan
                                    </Button>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>Laporan Jumlah Tamu per Jenis Kamar</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={handleButtonJumlahTamu}>
                                        Laporan
                                    </Button>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell>Laporan Top 5 Customer</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={handleButtonTopCustomer}>
                                        Laporan
                                    </Button>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <CustomFooter />

            <Modal isOpen={isModalOpen} onOpenChange={handleCloseModal} size="xl" style={{ top: "100px" }}>

                <ModalContent>
                    <ModalHeader>Laporan Customer</ModalHeader>
                    {dataLaporanCustomerBaru && (
                        <ModalBody>
                            <img src="https://i.ibb.co/dbTn7nD/logo.jpg" alt="logo" />
                            <div className="text-center mt-4 mb-4">
                                <p>Jl. P. Mangkubumi No.18, Yogyakarta 55233</p>
                            </div>
                            <hr className="mt-4 mb-4" />
                            <div className="text-center mt-4 mb-4">
                                <h2>LAPORAN CUSTOMER BARU</h2>
                            </div>
                            <div className="text-start mb-2">
                                <p>Tahun: {dataLaporanCustomerBaru.data.tahun}</p>
                            </div>

                            <table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Bulan</th>
                                        <th>Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataLaporanCustomerBaru.data ? (
                                        <>
                                            {dataLaporanCustomerBaru.data.dataLaporan.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">{index + 1}</td>
                                                    <td className="text-center">{item.bulan}</td>
                                                    <td className="text-center">{item.jumlah_customer}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className="text-right" colSpan="3">
                                                    Total Customer Baru: <b>{dataLaporanCustomerBaru.data.total_customer_baru} customer</b>
                                                </td>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan="3">Loading...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="mt-4 pt-4">
                                <p>Dicetak pada tanggal <b>{dataLaporanCustomerBaru.data.tanggal_cetak}</b></p>
                            </div>
                        </ModalBody>
                    )}
                    <ModalFooter>
                        <Button color="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isModalPendapatan} onOpenChange={handleClosePendapatan} size="xl" style={{ top: "100px" }}>
                <ModalContent>
                    <ModalHeader>Laporan Pendapatan</ModalHeader>
                    {dataPendapatan && (
                        <ModalBody>
                            {/* Adjust the JSX based on your needs */}
                            <img src="https://i.ibb.co/dbTn7nD/logo.jpg" alt="logo" />
                            <div className="text-center mt-4 mb-4">
                                <p>Jl. P. Mangkubumi No.18, Yogyakarta 55233</p>
                                <p>Telp. (0274) 487711</p>
                            </div>
                            <hr className="mt-4 mb-4" />
                            <div className="text-center mt-4 mb-4">
                                <h2>LAPORAN PENDAPATAN</h2>
                            </div>
                            <div className="text-start mb-2">
                                <p>Tahun: {dataPendapatan.data.tahun}</p>
                            </div>

                            <table style={{ borderWidth: 1, borderColor: "black" }}>
                                {/* Adjust the table structure based on your needs */}
                                <thead style={{ borderWidth: 1, borderColor: "black" }}>
                                    <tr>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>No</th>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>Bulan</th>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>Grup</th>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>Personal</th>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataPendapatan.data.dataLaporan.map((item, index) => (
                                        <tr key={index} style={{ borderWidth: 1, borderColor: "black" }}>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{index + 1}</td>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{item.bulan}</td>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.pendapatan_grup)}</td>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.pendapatan_personal)}</td>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.pendapatan_per_bulan)}</td>
                                        </tr>
                                    ))}

                                    <tr style={{ borderWidth: 1, borderColor: "black" }}>
                                        <td className="text-right" colSpan="4" style={{ borderWidth: 1, borderColor: "black" }}>
                                            Total Pendapatan
                                        </td>
                                        <td className="text-left" colSpan="1" style={{ borderWidth: 1, borderColor: "black" }}>
                                            <b>{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(dataPendapatan.data.total_pendapatan)}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-4 pt-4">
                                <p>Dicetak pada tanggal <b>{dataPendapatan.data.tanggal_cetak}</b></p>
                            </div>
                        </ModalBody>
                    )}
                    <ModalFooter>
                        <Button color="secondary" onClick={handleClosePendapatan}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isModalJumlahTamu} onOpenChange={handleCloseJumlahTamu} size="xl" style={{ top: "100px" }}>
                <ModalContent>
                    <ModalHeader>Laporan Jumlah Tamu</ModalHeader>
                    {dataJumlahTamu && (
                        <ModalBody>
                            {/* Adjust the JSX based on your needs */}
                            <img src="https://i.ibb.co/dbTn7nD/logo.jpg" alt="logo" />
                            <div className="text-center mt-4 mb-4">
                                <p>Jl. P. Mangkubumi No.18, Yogyakarta 55233</p>
                                <p>Telp. (0274) 487711</p>
                            </div>
                            <hr className="mt-4 mb-4" />
                            <div className="text-center mt-4 mb-4">
                                <h2>LAPORAN TAMU</h2>
                            </div>
                            <div className="text-start mb-2">
                                <p>Tahun: {dataJumlahTamu.data.tahun}</p>
                            </div>

                            <table style={{ borderWidth: 1, borderColor: "black" }}>
                                {/* Adjust the table structure based on your needs */}
                                <thead style={{ borderWidth: 1, borderColor: "black" }}>
                                    <tr>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>No</th>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>Jenis Kamar</th>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>Grup</th>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>Personal</th>
                                        <th className="text-start" style={{ borderWidth: 1, borderColor: "black" }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataJumlahTamu.data.dataLaporan.map((item, index) => (
                                        <tr key={index} style={{ borderWidth: 1, borderColor: "black" }}>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{index + 1}</td>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{item.jenis_kamar}</td>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{item.Group}</td>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{item.Personal}</td>
                                            <td style={{ borderWidth: 1, borderColor: "black" }}>{item.Total}</td>
                                        </tr>
                                    ))}

                                    <tr style={{ borderWidth: 1, borderColor: "black" }}>
                                        <td className="text-right" colSpan="4" style={{ borderWidth: 1, borderColor: "black" }}>
                                            Total Tamu
                                        </td>
                                        <td className="text-left" colSpan="1" style={{ borderWidth: 1, borderColor: "black" }}>
                                            <b>{dataJumlahTamu.data.total_tamu} tamu</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-4 pt-4">
                                <p>Dicetak pada tanggal <b>{dataJumlahTamu.data.tanggal_cetak}</b></p>
                            </div>
                        </ModalBody>
                    )}
                    <ModalFooter>
                        <Button color="secondary" onClick={handleCloseJumlahTamu}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isModalTopCustomer} onOpenChange={handleCloseTopCustomer} size="xl" style={{ top: "100px" }}>
                <ModalContent>
                    <ModalHeader>Laporan Top 5 Customer</ModalHeader>
                    {dataTopCustomer && (
                        <ModalBody>
                            <img src="https://i.ibb.co/dbTn7nD/logo.jpg" alt="logo" />
                            <div className="text-center mt-4 mb-4">
                                <p>Jl. P. Mangkubumi No.18, Yogyakarta 55233</p>
                                <p>Telp. (0274) 487711</p>
                            </div>
                            <hr className="mt-4 mb-4" />
                            <div className="text-center mt-4 mb-4">
                                <h2>LAPORAN TOP 5 CUSTOMER</h2>
                            </div>
                            <div className="text-start mb-2">
                                <p>Tahun: {new Date().getFullYear()}</p>
                            </div>

                            <Table style={{ borderWidth: 1, borderColor: "black" }}>
                                <TableHeader>
                                    <TableColumn>No</TableColumn>
                                    <TableColumn>Nama Customer</TableColumn>
                                    <TableColumn>Jumlah Reservasi</TableColumn>
                                    <TableColumn>Total Pembayaran</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {dataTopCustomer.data.dataLaporan.map((item, index) => (
                                        <TableRow key={index} style={{ borderWidth: 1, borderColor: "black" }}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.jumlah_reservasi}</TableCell>
                                            <TableCell>
                                                {item.total_pembayaran ? (
                                                    Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(item.total_pembayaran.replace(/\./g, '')))
                                                ) : (
                                                    'N/A'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-5">
                                <p>Dicetak pada tanggal: <b>{dataTopCustomer.data.tanggal_cetak}</b></p>
                            </div>
                        </ModalBody>
                    )}
                    <ModalFooter>
                        <Button color="secondary" onClick={handleCloseTopCustomer}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
