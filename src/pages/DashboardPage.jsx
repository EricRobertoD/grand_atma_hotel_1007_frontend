import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, AccordionItem, Accordion, Card, SelectItem, Select} from "@nextui-org/react";
import NavbarLogin from "../components/NavbarLogin";
import CustomFooter from "../components/Footer";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import JenisKamarSlider from "../components/JenisKamarSlider";
import axios from "axios";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [reservasi, setReservasi] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [kamarAvailability, setKamarAvailability] = useState({});
  const [selectedFasilitasId, setSelectedFasilitasId] = useState(null);
  const [jumlahFasilitas, setJumlahFasilitas] = useState(1);
  const [isAddFasilitasModalOpen, setIsAddFasilitasModalOpen] = useState(false);
  const [fasilitasOptions, setFasilitasOptions] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isBayar, setIsBayar] = useState(false);


  const openDetailsModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsModalOpen(true);
  };
  const showConfirmationBayar = () => {
    setIsBayar(true);
  };
  const hideConfirmationBayar = () => {
    setIsBayar(false);
  };

  const calculateTotalTransaction = (reservation) => {
    if (!reservation) return 0;

    const transaksiKamarTotal = reservation.transaksi_kamar.reduce(
      (total, transaction) => total + (transaction.harga_total || 0),
      0
    );

    const fasilitasTambahanTotal = reservation.transaksi_fasilitas_tambahan.reduce(
      (total, transaction) => total + (transaction.total_harga_fasilitas || 0),
      0
    );

    return transaksiKamarTotal + fasilitasTambahanTotal;
  };

  const [dataReservasi, setDataReservasi] = useState({
    tanggal_mulai: "",
    tanggal_selesai: "",
    dewasa: "",
    anak: "",
    permintaan_khusus: "",
    superior: 0,
    double_deluxe: 0,
    executive_deluxe: 0,
    junior_suite: 0,
  });

  const today = new Date(); // Get today's date in local timezone
const jakartaToday = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

const formattedJakartaToday = jakartaToday.toISOString().split('T')[0];

  const pembayaran = async () => {
    Swal.showLoading();
    const formData = new FormData();
    formData.append("gambar", selectedFile);
    formData.append("id_reservasi", selectedReservation.id_reservasi);
    formData.append("status", "Lunas");
    const authToken = localStorage.getItem("authToken");

    axios({
      method: 'post',
      url: `http://127.0.0.1:8000/api/updateBayar/${selectedReservation.id_reservasi}`,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: formData,
    })
      .then((response) => {
        if (response.data.status === 'success') {
          setIsAddFasilitasModalOpen(false);
          fetchData();
          Swal.fire({
            icon: "success",
            title: "Bayar Successful",
            text: "Bayar Successful",
          });
        } else {
          console.log('Bayar failed');

          if (response.data.errors) {
            const errorMessages = Object.values(response.data.errors).join('\n');
            Swal.fire({
              icon: 'error',
              title: 'Bayar Failed',
              text: errorMessages,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Bayar Failed',
              text: 'Please check the details.',
            });
          }
        }
      })
      .catch((error) => {
        Swal.close();
        console.error('Error:', error);
      });
  };



  const fetchDataFasilitas = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("http://127.0.0.1:8000/api/fasilitasTambahan", {
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
  };

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("http://127.0.0.1:8000/api/reservasi", {
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
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const downloadTandaTerima = async (id) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/api/tandaTerimaReservasi/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Assuming the response is a PDF file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tanda_terima.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF: ", error);
    }
  };


  const fetchKamarAvailability = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        console.error("startDate and endDate are required.");
        return;
      }

      const authToken = localStorage.getItem("authToken");
      const response = await fetch("http://127.0.0.1:8000/api/reservasiAvailable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Use "Content-Type" instead of "Accept"
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          tanggal_mulai: startDate,
          tanggal_selesai: endDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setKamarAvailability(result.data);
    } catch (error) {
      console.error("Error fetching kamar availability: ", error);
    }
  };

  const storeFasilitasTambahan = () => {
    const dataFasilitas = {
      id_reservasi: reservasi.id_reservasi,
      id_fasilitas: selectedFasilitasId,
      jumlah: jumlahFasilitas,
    };
    setReservasi(null);
    console.log(dataFasilitas);

    const authToken = localStorage.getItem("authToken");

    fetch('http://127.0.0.1:8000/api/transaksiFasilitas', {
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
          fetchData(); // Refresh data (you can also update state)
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
  };


  useEffect(() => {
    const filteredData = data.filter((row) => {
      return row.id_booking
        ?.toLowerCase()
        .includes(search.trim().toLowerCase());
    });
    setFilteredData(filteredData);
  }, [search, data]);




  const createReservasi = () => {
    Swal.showLoading();
    const authToken = localStorage.getItem("authToken");
    fetch('http://127.0.0.1:8000/api/reservasi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(dataReservasi),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.close();

        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Created Reservasi Successful',
            text: 'You have Created Reservasi',
          });
          console.log('Create Reservasi successful');
          fetchData();
          fetchKamarAvailability();
          setDataReservasi({
            tanggal_mulai: "",
            tanggal_selesai: "",
            dewasa: "",
            anak: "",
            permintaan_khusus: "",
            superior: "",
            double_deluxe: "",
            executive_deluxe: "",
            junior_suite: "",
          });
        } else {
          console.log('Create Reservasi failed');

          if (data.errors) {
            const errorMessages = Object.values(data.errors).join('\n');
            Swal.fire({
              icon: 'error',
              title: 'Create Reservasi Failed',
              text: errorMessages,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Create Reservasi Failed',
              text: 'Please check the create Reservasi details.',
            });
          }
        }
      })
      .catch((error) => {
        Swal.close();
        console.error('Error:', error);
      });
  };


  useEffect(() => {
    fetchData();
    fetchDataFasilitas();
  }, []);

  return (
    <>
      <NavbarLogin />
      <Card className="px-10 py-10">
        <Button onClick={setIsCreate} className="absolute right-20 top-20" color="primary" variant="flat">
          Create
        </Button>
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
              <TableColumn>id booking</TableColumn>
              <TableColumn>Tanggal Reservasi</TableColumn>
              <TableColumn>Tanggal Menginap</TableColumn>
              <TableColumn>Tanggal Selesai</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Detail</TableColumn>
              <TableColumn>Tanda Terima</TableColumn>
              <TableColumn>Fasilitas</TableColumn>
              <TableColumn>Bayar</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id_reservasi}>
                  <TableCell>{row.id_booking}</TableCell>
                  <TableCell>{row.tanggal_reservasi}</TableCell>
                  <TableCell>{row.tanggal_mulai}</TableCell>
                  <TableCell>{row.tanggal_selesai}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="flat"
                      onClick={() => {
                        setReservasi(row);
                        onOpen();
                      }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                  <TableCell>

                    <Button
                      color="secondary"
                      variant="flat"
                      onClick={() => {
                        downloadTandaTerima(row.id_reservasi); // Pass the reservation ID to the function
                      }}
                    >
                      PDF
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="flat"
                      onClick={() => {
                        setReservasi(row);
                        setIsAddFasilitasModalOpen(true);
                      }}
                      disabled={row.status === "Lunas"}
                    >
                      Add
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="flat"
                      onClick={() => openDetailsModal(row)}
                      disabled={row.status === "Lunas"} // Open the new details modal
                    >
                      Bayar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <JenisKamarSlider />
      </Card>

      <CustomFooter />
      <Modal
        size={"2xl"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detail Reservasi
              </ModalHeader>
              <ModalBody>
                <Accordion>
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    subtitle="Tekan untuk detail"
                    title="Detail Reservasi"
                  >
                    <div className="col-span-1">
                      <Input
                        label="Id Booking"
                        disabled
                        variant="bordered"
                        value={reservasi ? reservasi.id_booking : ""}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Tanggal Reservasi"
                        disabled
                        variant="bordered"
                        value={reservasi ? reservasi.tanggal_reservasi : ""}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Tanggal Check In"
                        disabled
                        variant="bordered"
                        value={reservasi ? reservasi.tanggal_checkin : ""}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Tanggal Check Out"
                        disabled
                        variant="bordered"
                        value={reservasi ? reservasi.tanggal_checkout : ""}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Status"
                        disabled
                        variant="bordered"
                        value={reservasi ? reservasi.status : ""}
                      />
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label="Accordion 2"
                    subtitle="Tekan untuk detail"
                    title="Detail Kamar"
                  >
                    <div>
                      {reservasi.transaksi_kamar.map((transaction, index) => (
                        <div className="col-span-1" key={index}>
                          <Input
                            label={`Jenis Kamar ${index + 1}`}
                            disabled
                            variant="bordered"
                            value={transaction.kamar?.jenis_kamar?.jenis_kamar || ""}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      {reservasi.transaksi_kamar.map((transaction, index) => (
                        <div className="col-span-1" key={index}>
                          <Input
                            label={`Jenis Bed ${index + 1}`}
                            disabled
                            variant="bordered"
                            value={transaction.kamar?.pilih_bed || ""}
                          />
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    aria-label="Accordion 3"
                    subtitle="Tekan untuk detail"
                    title="Detail Nota"
                  >
                    <div className="col-span-1">
                      <Input
                        label="Nomor Nota"
                        disabled
                        variant="bordered"
                        value={reservasi.nota_pelunasan[0]?.no_nota || ""}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Total Harga"
                        disabled
                        variant="bordered"
                        value={reservasi.nota_pelunasan[0]?.total_harga || ""}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Total Pajak"
                        disabled
                        variant="bordered"
                        value={reservasi.nota_pelunasan[0]?.total_pajak || ""}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Total Harga setelah Pajak"
                        disabled
                        variant="bordered"
                        value={
                          reservasi.nota_pelunasan[0]?.total_semua || ""
                        }
                      />
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    key="4"
                    aria-label="Accordion 4"
                    subtitle="Tekan untuk detail"
                    title="Detail Fasilitas Tambahan"
                  >
                    <div>
                      {reservasi.transaksi_fasilitas_tambahan.map((transaction, index) => (
                        <div className="col-span-1" key={index}>
                          <Input
                            label={`Fasilitas Tambahan ${index + 1}`}
                            disabled
                            variant="bordered"
                            value={transaction.fasilitas_tambahan.fasilitas_tambahan || ""}
                          />
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                </Accordion>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        size={"2xl"}
        isOpen={isDetailsModalOpen}
        onOpenChange={() => setIsDetailsModalOpen(false)}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reservation Details
              </ModalHeader>
              <ModalBody>
                {selectedReservation && (
                  <>
                    <div className="col-span-1">
                      <Input
                        label="Id Booking"
                        disabled
                        variant="bordered"
                        value={selectedReservation.id_booking}
                      />
                    </div>
                    <Accordion>
                      <AccordionItem
                        key="1"
                        aria-label="Accordion 1"
                        subtitle="Tekan untuk detail"
                        title="Detail Kamar"
                      >
                        <div>
                          {selectedReservation.transaksi_kamar.map((transaction, index) => (
                            <div className="col-span-1 mb-2" key={index}>
                              <Card className="p-2 max-w-[400px] ml-2 border-2 ">
                                <p>{transaction.kamar?.jenis_kamar?.jenis_kamar || ""}</p>
                                <p className="text-small text-default-500">Tarif Kamar: {transaction.harga_total}</p>
                              </Card>
                            </div>
                          ))}
                        </div>
                      </AccordionItem>
                      <AccordionItem
                        key="2"
                        aria-label="Accordion 2"
                        subtitle="Tekan untuk detail"
                        title="Detail Fasilitas Tambahan"
                      >
                        <div>
                          {selectedReservation.transaksi_fasilitas_tambahan.map((transaction, index) => (
                            <div className="col-span-1 mb-2" key={index}>
                              <Card className="p-2 max-w-[400px] ml-2 border-2 ">
                                <p>{transaction.fasilitas_tambahan.fasilitas_tambahan || ""} - {transaction.jumlah}</p>
                                <p className="text-small text-default-500">Tarif Fasilitas: {transaction.total_harga_fasilitas}</p>
                              </Card>
                            </div>
                          ))}
                        </div>
                      </AccordionItem>
                    </Accordion>
                    <div className="col-span-1">
                      <Input
                        label="Total Transaksi"
                        disabled
                        variant="bordered"
                        value={
                          calculateTotalTransaction(selectedReservation)
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Nomor Rekening"
                        disabled
                        variant="bordered"
                        value="8298745698"
                      />
                    </div>
                    <div className="col-span-1">
                      <Card className="p-4" >
                        <input
                          type="file"
                          label="Bukti Pembayaran"
                          onChange={
                            (e) => setSelectedFile(e.target.files[0])
                          }
                        /></Card>
                    </div>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={() => onClose()}>
                  Close
                </Button>
                <Button color="primary" onPress={showConfirmationBayar}>
                  Bayar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal size="md" isOpen={isBayar} onOpenChange={hideConfirmationBayar}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Confirmation</ModalHeader>
          <ModalBody>
            Apakah anda yakin sudah membayar??
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => {
              hideConfirmationBayar();
            }}>
              Cancel
            </Button>
            <Button color="primary" onPress={() => {
              pembayaran();
            }}>
              Confirm Save
            </Button>
          </ModalFooter>
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

      <Modal
        size={"2xl"}
        isOpen={isCreate}
        onOpenChange={setIsCreate}
        scrollBehavior={"inside"}
      ><ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Reservasi
              </ModalHeader>
              <ModalBody>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="Date"
                      label="Tanggal Mulai Menginap"
                      variant="bordered"
                      value={dataReservasi.tanggal_mulai}
                      onChange={(e) => setDataReservasi({ ...dataReservasi, tanggal_mulai: e.target.value })}
                      min={formattedJakartaToday}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="Date"
                      label="Tanggal Selesai Menginap"
                      variant="bordered"
                      value={dataReservasi.tanggal_selesai}
                      onChange={(e) => setDataReservasi({ ...dataReservasi, tanggal_selesai: e.target.value })}
                      min={dataReservasi.tanggal_mulai}
                    />
                  </div>
                </div>
                <div>
                  <Button
                    color="primary"
                    variant="flat"
                    onClick={() =>
                      fetchKamarAvailability(
                        dataReservasi.tanggal_mulai,
                        dataReservasi.tanggal_selesai
                      )
                    }
                  >
                    Check Availability
                  </Button>
                  <div className="flex">
                    {Object.keys(kamarAvailability).map((jenisKamar) => (
                      <div key={jenisKamar} className="p-2">
                        <Card className="p-2">
                          <h2>{jenisKamar}</h2>
                          <p>Tersedia: {kamarAvailability[jenisKamar].tersedia}</p>
                          <div className="col-span-1">
                            {kamarAvailability[jenisKamar].tarif_season ? (
                              <p>Tarif Season: {kamarAvailability[jenisKamar].tarif_season}</p>
                            ) : (
                              <p>Tarif: {kamarAvailability[jenisKamar].tarif_default}</p>
                            )}
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="col-span-1">
                    <Input
                      type="Number"
                      label="Superior"
                      variant="bordered"
                      value={dataReservasi.superior || 0}
                      onChange={(e) => setDataReservasi({ ...dataReservasi, superior: e.target.value })}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="Number"
                      label="Double Deluxe"
                      variant="bordered"
                      value={dataReservasi.double_deluxe || 0}
                      onChange={(e) => setDataReservasi({ ...dataReservasi, double_deluxe: e.target.value })}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="Number"
                      label="Executive Deluxe"
                      variant="bordered"
                      value={dataReservasi.executive_deluxe || 0}
                      onChange={(e) => setDataReservasi({ ...dataReservasi, executive_deluxe: e.target.value })}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="Number"
                      label="Junior Suite"
                      variant="bordered"
                      value={dataReservasi.junior_suite || 0}
                      onChange={(e) => setDataReservasi({ ...dataReservasi, junior_suite: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <Input
                    type="Number"
                    label="Jumlah Dewasa"
                    variant="bordered"
                    value={dataReservasi.dewasa}
                    onChange={(e) => setDataReservasi({ ...dataReservasi, dewasa: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="Number"
                    label="Jumlah Anak"
                    variant="bordered"
                    value={dataReservasi.anak}
                    onChange={(e) => setDataReservasi({ ...dataReservasi, anak: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="Text"
                    label="Permintaan Khusus"
                    variant="bordered"
                    value={dataReservasi.permintaan_khusus}
                    onChange={(e) => setDataReservasi({ ...dataReservasi, permintaan_khusus: e.target.value })}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => {
                  onClose();
                  setDataReservasi({
                    tanggal_mulai: "",
                    tanggal_selesai: "",
                    dewasa: "",
                    anak: "",
                    permintaan_khusus: "",
                  });
                }}>
                  Close
                </Button>
                <Button color="primary" onPress={createReservasi}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>


    </>
  );
}
