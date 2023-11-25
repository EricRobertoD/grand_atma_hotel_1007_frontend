import { useEffect, useState } from "react";
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Tabs, Tab, Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem, ModalFooter } from "@nextui-org/react";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";
import CustomFooter from "../components/Footer";
import Swal from "sweetalert2";

export default function CheckInPageAdmin() {
    const [search, setSearch] = useState("");
    const [checkInData, setCheckInData] = useState([]);
    const [notaData, setNotaData] = useState([]);
    const [activeTab, setActiveTab] = useState("photos");
    const [selectedFasilitasId, setSelectedFasilitasId] = useState(null);
    const [isAddFasilitasModalOpen, setIsAddFasilitasModalOpen] = useState(false);
    const [jumlahFasilitas, setJumlahFasilitas] = useState(1);
    const [fasilitasOptions, setFasilitasOptions] = useState([]);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);  // Add this line
    const [reservasi, setReservasi] = useState(null);  // Add this line

    const openNewModal = () => {
        setIsNewModalOpen(true);
    };

    
  const fetchDataFasilitas = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("https://p3l-be-eric.frederikus.com/api/fasilitasTambahan", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setFasilitasOptions(result.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
}


const storeFasilitasTambahan = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to store this Fasilitas Tambahan?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Store Fasilitas Tambahan!",
    }).then((result) => {
      if (result.isConfirmed) {
        const dataFasilitas = {
          id_reservasi: reservasi.id_reservasi,
          id_fasilitas: selectedFasilitasId,
          jumlah: jumlahFasilitas,
        };
        setReservasi(null);
        console.log(dataFasilitas);

        const authToken = localStorage.getItem("authToken");

        fetch('https://p3l-be-eric.frederikus.com/api/transaksiFasilitasCheckIn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(dataFasilitas),
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.status === 'success') {
              setIsAddFasilitasModalOpen(false); // Close the modal
              fetchCheckInData(); // Refresh data (you can also update state)
              fetchNota();
              fetchDataFasilitas();
              Swal.fire({
                icon: "success",
                title: "Created Fasilitas Tambahan Successful",
                text: "You have Created Fasilitas Tambahan",
              });
            } else {
              console.log('Create Fasiltias Tambahan failed');

              if (responseData.errors) {
                const errorMessages = Object.values(responseData.errors).join('\n');
                Swal.fire({
                  icon: 'error',
                  title: 'Create Fasilitas Tambahan Failed',
                  text: errorMessages,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Create Fasilitas Tambahan Failed',
                  text: 'Please check the create Fasilitas Tambahan details.',
                });
              }
            }
          })
          .catch((error) => {
            Swal.close();
            console.error('Error:', error);
          });
      }
    });
  };

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

    const fetchNota = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch("https://p3l-be-eric.frederikus.com/api/showNota", {
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
            setNotaData(result.data);
        } catch (error) {
            console.error("Error fetching nota data: ", error);
        }
    };

    useEffect(() => {
        fetchCheckInData();
        fetchNota();
        fetchDataFasilitas();
    }, []);

    const handleCheckClick = (id_reservasi, isCheckIn) => {
        checkReservation(id_reservasi, isCheckIn);
    };
    
    const checkReservation = async (id_reservasi, isCheckIn) => {
        try {
            const authToken = localStorage.getItem("authToken");
            const status = isCheckIn ? "Check In" : "Check Out";
            const url = isCheckIn
                ? `https://p3l-be-eric.frederikus.com/api/checkIn/${id_reservasi}`
                : `https://p3l-be-eric.frederikus.com/api/checkOut/${id_reservasi}`;
    
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
                    const response = await fetch(url, {
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
                        if (isCheckIn) {
                            await fetchCheckInData(); // wait for this operation to complete
                        } else {
                            await fetchCheckInData(); 
                            await fetchNota(); // wait for this operation to complete
                        }
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
    
    

    const renderPhotosTableBody = () => {
        return (
            <TableBody>
                {checkInData
                    .filter((item) => {
                        const lowerCaseSearch = search.trim().toLowerCase();
                        return (
                            item.id_booking.toLowerCase().includes(lowerCaseSearch) ||
                            item.tanggal_reservasi.toLowerCase().includes(lowerCaseSearch) ||
                            item.customer.nama.toLowerCase().includes(lowerCaseSearch)
                        );
                    })
                    .map((item) => (
                        <TableRow key={item.id_reservasi}>
                            <TableCell>{item.customer.nama}</TableCell>
                            <TableCell>{item.id_booking}</TableCell>
                            <TableCell>{item.tanggal_reservasi}</TableCell>
                            <TableCell>{item.tanggal_mulai}</TableCell>
                            <TableCell>{item.tanggal_selesai}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{item.total_deposit}</TableCell>
                            <TableCell>
                                {activeTab === "photos" && (
                                    <Button
                                        color="success"
                                        variant="flat"
                                        onClick={() => handleCheckClick(item.id_reservasi, true)}
                                        disabled={item.status === "Check In" || item.status === "Check Out"}
                                        style={{ opacity: item.status === "Check In" || item.status === "Check Out" ? 0.6 : 1 }}
                                    >
                                        Check In
                                    </Button>
                                )}
                            </TableCell>
                            <TableCell>
                                {activeTab === "photos" && (
                                    <Button
                                        color="warning"
                                        variant="flat"
                                        onClick={() => handleCheckClick(item.id_reservasi, false)}
                                        disabled={item.status === "Check Out"}
                                        style={{ opacity: item.status === "Check Out" ? 0.6 : 1 }}
                                    >
                                        Check Out
                                    </Button>
                                )}
                            </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="flat"
                      onClick={() => {
                        setReservasi(item);
                        setIsAddFasilitasModalOpen(true);
                      }}

                      disabled={item.status == "Check Out"}
                      style={{ opacity: item.status == "Check Out" ? 0.6 : 1 }}
                    >
                      Add
                    </Button>
                  </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        );
    };

    const renderVideosTableBody = () => {
        return (
            <TableBody>
                {notaData
                    .filter((item) => {
                        const lowerCaseSearch = search.trim().toLowerCase();
                        return (
                            item.id_booking.toLowerCase().includes(lowerCaseSearch) ||
                            item.tanggal_reservasi.toLowerCase().includes(lowerCaseSearch) ||
                            item.customer.nama.toLowerCase().includes(lowerCaseSearch)
                        );
                    })
                    .map((item) => (
                        <TableRow key={item.id_reservasi}>
                            <TableCell>{item.customer.nama}</TableCell>
                            <TableCell>{item.id_booking}</TableCell>
                            <TableCell>{item.tanggal_reservasi}</TableCell>
                            <TableCell>{item.tanggal_mulai}</TableCell>
                            <TableCell>{item.tanggal_selesai}</TableCell>
                            <TableCell>
                                <Button
                                    color="secondary"
                                    variant="flat"
                                    onClick={() => {
                                        setReservasi(item);
                                        openNewModal();
                                    }}
                                >
                                    Nota
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        );
    };

    const totalKamarPrice = reservasi?.transaksi_kamar.reduce(
        (total, transaksi_kamar) =>
            total + transaksi_kamar.harga_total * transaksi_kamar.jumlah,
        0
    );

    const totalFasilitasPrice = reservasi?.transaksi_fasilitas_tambahan.reduce(
        (total, transaksi_fasilitas_tambahan) =>
            total + Number(transaksi_fasilitas_tambahan.total_harga_fasilitas),
        0
    );


    return (
        <>
            <NavbarLoginAdmin />
            <Card className="px-10 py-10">
                <div className="container mx-auto py-10">
                    <Input
                        className="w-60 py-10"
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
                        <Tab key="photos" title="Check in">
                            <Table>
                                <TableHeader>
                                    <TableColumn>Nama Customer</TableColumn>
                                    <TableColumn>ID Booking</TableColumn>
                                    <TableColumn>Tanggal Reservasi</TableColumn>
                                    <TableColumn>Tanggal Mulai</TableColumn>
                                    <TableColumn>Tanggal Selesai</TableColumn>
                                    <TableColumn>Status</TableColumn>
                                    <TableColumn>Deposit</TableColumn>
                                    <TableColumn>Check In</TableColumn>
                                    <TableColumn>Check Out</TableColumn>
                                    <TableColumn>Fasilitas Tambahan</TableColumn>
                                </TableHeader>
                                {renderPhotosTableBody()}
                            </Table>
                        </Tab>
                        <Tab key="videos" title="Nota">
                            <Table>
                                <TableHeader>
                                    <TableColumn>Nama Customer</TableColumn>
                                    <TableColumn>ID Booking</TableColumn>
                                    <TableColumn>Tanggal Reservasi</TableColumn>
                                    <TableColumn>Tanggal Mulai</TableColumn>
                                    <TableColumn>Tanggal Selesai</TableColumn>
                                    <TableColumn>Status</TableColumn>
                                </TableHeader>
                                {renderVideosTableBody()}
                            </Table>
                        </Tab>
                    </Tabs>
                </div>
            </Card>


            <Modal
                size={"2xl"}
                isOpen={isNewModalOpen}
                onOpenChange={() => setIsNewModalOpen(false)}
                scrollBehavior={"inside"}
            ><ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Detail Reservasi
                    </ModalHeader>
                    <ModalBody>
                        <div className="py-5 px-5">
                            <div className="text-center">
                                <div className="mb-4">
                                    <img
                                        src="https://firebasestorage.googleapis.com/v0/b/capstone-cdb77.appspot.com/o/logo.png?alt=media&token=c134b6af-1e0d-434e-b381-dcd077196515&_gl=1*a58tki*_ga*MjEyODU5OTQ5MC4xNjg5OTc4NjE0*_ga_CW55HF8NVT*MTY5NzUyMjg4Ni4yNC4xLjE2OTc1MjI5MzYuMTAuMC4w"
                                        alt="Logo"
                                    />
                                </div>
                                <p>Jl. P. Mangkubumi No.18, Yogyakarta 55233</p>
                            </div>
                            <hr className="mb-4" />
                            <div className="text-center">
                                <h3 className="font-weight-bold">INVOICE</h3>
                            </div>
                            <hr className="mb-4" />
                            <div className="text-end">
                                <p>Tgl. Reservasi: <b>{reservasi?.tanggal_reservasi || "-"}</b></p>
                                <p>No. Invoice: <b>{reservasi?.nota_pelunasan[0]?.no_nota || "-"}</b></p>
                                <p>FO: <b>{reservasi?.nota_pelunasan[0]?.pegawai?.nama_pegawai || "-"}</b></p>
                            </div>
                            <div className="text-start mt-2">
                                <p>ID Booking: <b>{reservasi?.tanggal_reservasi || "-"}</b></p>
                                <p>Nama: <b>{reservasi?.customer?.nama || "-"}</b></p>
                                <p>Alamat: <b>{reservasi?.customer?.alamat || "-"}</b></p>
                            </div>
                            <hr className="mt-4 mb-2" />
                            <div className="text-center">
                                <h3 className="font-weight-bold">DETAIL</h3>
                            </div>
                            <hr className="mb-3" />
                            <div className="text-start">
                                <p>Check In: <b>{reservasi?.tanggal_checkin || "-"}</b></p>
                                <p>Check Out: <b>{reservasi?.tanggal_checkout || "-"}</b></p>
                                <p>Dewasa: <b>{reservasi?.dewasa || "-"}</b></p>
                                <p>Anak: <b>{reservasi?.anak || "-"}</b></p>
                            </div>
                            <hr className="mt-4 mb-3" />
                            <div className="text-center">
                                <h3 className="font-weight-bold">KAMAR</h3>
                            </div>
                            <hr className="mb-3" />
                            <div className="w-full">
                                <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th className="text-start">Jenis Kamar</th>
                                        <th className="text-start">Bed</th>
                                        <th className="text-start">Jumlah</th>
                                        <th className="text-start">Harga</th>
                                        <th className="text-start">Sub Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservasi?.transaksi_kamar?.map((transaksi_kamar) => (
                                        <tr key={transaksi_kamar?.id_transaksi_kamar}>
                                            <td>{transaksi_kamar?.kamar?.jenis_kamar?.jenis_kamar}</td>
                                            <td>{transaksi_kamar?.kamar?.pilih_bed}</td>
                                            <td>{transaksi_kamar?.jumlah}</td>
                                            <td>Rp{transaksi_kamar?.kamar?.jenis_kamar?.harga_default}</td>
                                            <td>Rp{transaksi_kamar?.harga_total}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="5" className="text-right">
                                            <b>Rp.{totalKamarPrice}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                            <hr className="mt-4 mb-3" />
                            <div className="text-center">
                                <h3 className="font-weight-bold">FASILITAS</h3>
                            </div>
                            <hr className="mb-3" />
                            <div className="w-full">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Fasilitas</th>
                                            <th className="text-start">Jumlah</th>
                                            <th className="text-start">Harga</th>
                                            <th className="text-start">Sub Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservasi?.transaksi_fasilitas_tambahan.map(
                                            (transaksi_fasilitas_tambahan) => (
                                                <tr key={transaksi_fasilitas_tambahan}>
                                                    <td>{transaksi_fasilitas_tambahan?.fasilitas_tambahan?.fasilitas_tambahan}</td>
                                                    <td>{transaksi_fasilitas_tambahan?.jumlah}</td>
                                                    <td>Rp{transaksi_fasilitas_tambahan?.fasilitas_tambahan?.tarif}</td>
                                                    <td>Rp{transaksi_fasilitas_tambahan?.total_harga_fasilitas}</td>
                                                </tr>
                                            )
                                        )}
                                        <tr>
                                            <td colSpan="4" className="text-right">
                                                <b>Rp{totalFasilitasPrice}</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="text-end mt-4">
                                <p>Tax: <b>Rp{totalFasilitasPrice * 0.1}</b></p>
                                <p>TOTAL: <b>Rp{totalFasilitasPrice + totalKamarPrice + totalFasilitasPrice * 0.1} </b></p>
                                <p className="mt-4">Jaminan: <b>{reservasi?.total_jaminan}</b></p>
                                <p>Deposit: <b>Rp300000</b></p>
                            </div>
                            <hr className="mt-4 mb-2" />
                            <p className="text-center">Thank You for Your Visit!</p>
                            <hr className="mt-2 mb-2" />
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            
      <Modal
        size={"2xl"}
        isOpen={isAddFasilitasModalOpen}
        onOpenChange={() => setIsAddFasilitasModalOpen(false)}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add Fasilitas Tambahan</ModalHeader>
          <ModalBody>
            <div>
              <Select
                type="text"
                label="Fasilitas Tambahan"
                variant="bordered"
                value={selectedFasilitasId}
                onChange={(e) => setSelectedFasilitasId(e.target.value)}
              >
                {fasilitasOptions.map((option) => (
                  <SelectItem key={option.id_fasilitas} value={option.id_fasilitas}>
                    {option.fasilitas_tambahan}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Input
                type="number"
                label="Quantity"
                variant="bordered"
                value={jumlahFasilitas}
                onChange={(e) => setJumlahFasilitas(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsAddFasilitasModalOpen(false)}>
              Close
            </Button>
            <Button color="primary" onPress={storeFasilitasTambahan}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
            <CustomFooter />
        </>
    );
}
