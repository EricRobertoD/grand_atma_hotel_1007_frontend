import { useEffect, useState } from "react";
import { Card, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Accordion, AccordionItem, useDisclosure } from "@nextui-org/react";
import CustomFooter from "../components/Footer";
import { Input } from "@nextui-org/react";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";

export default function TransaksiPageAdmin() {
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [reservasiData, setReservasiData] = useState([]);
  const [detailsData, setDetailsData] = useState(null);



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

  const fetchReservasiData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("http://127.0.0.1:8000/api/reservasiGrup", {
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
      setReservasiData(result.data);
    } catch (error) {
      console.error("Error fetching reservation data: ", error);
    }
  };

  useEffect(() => {
    fetchReservasiData();
  }, []);

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
              <TableColumn>Tanggal Checkin</TableColumn>
              <TableColumn>Tanggal Checkout</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
              <TableColumn>Download PDF</TableColumn>
            </TableHeader>
            <TableBody>
              {reservasiData
                .filter((reservasi) => {
                  const lowerCaseSearch = search.trim().toLowerCase();
                  return (
                    reservasi.id_booking.toLowerCase().includes(lowerCaseSearch) ||
                    reservasi.tanggal_reservasi.toLowerCase().includes(lowerCaseSearch) ||
                    reservasi.customer.nama.toLowerCase().includes(lowerCaseSearch)
                  );
                })
                .map((reservasi) => (
                  <TableRow key={reservasi.id_reservasi}>
                    <TableCell>{reservasi.customer.nama}</TableCell>
                    <TableCell>{reservasi.id_booking}</TableCell>
                    <TableCell>{reservasi.tanggal_reservasi}</TableCell>
                    <TableCell>{reservasi.tanggal_checkin}</TableCell>
                    <TableCell>{reservasi.tanggal_checkout}</TableCell>
                    <TableCell>{reservasi.status}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={() => {
                          setDetailsData(reservasi);
                          onOpen();
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                    <TableCell>

                      <Button
                        color="secondary"
                        variant="flat"
                        onClick={() => {
                          downloadTandaTerima(reservasi.id_reservasi);
                        }}
                      >
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Reservation Details Modal */}
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
                        value={detailsData ? detailsData.id_booking : ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Tanggal Reservasi"
                        disabled
                        variant="bordered"
                        value={detailsData ? detailsData.tanggal_reservasi : ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Tanggal Check In"
                        disabled
                        variant="bordered"
                        value={detailsData ? detailsData.tanggal_checkin : ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Tanggal Check Out"
                        disabled
                        variant="bordered"
                        value={detailsData ? detailsData.tanggal_checkout : ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Status"
                        disabled
                        variant="bordered"
                        value={detailsData ? detailsData.status : ''}
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
                    {detailsData.transaksi_kamar.map((transaction, index) => (
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
                    {detailsData.transaksi_kamar.map((transaction, index) => (
                      <div className="col-span-1" key={index}>
                        <Input
                          label={`Jenis Bed ${index + 1}`} 
                          disabled
                          variant="bordered"
                          value={transaction.kamar?.pilih_bed|| ""}
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
                        value={detailsData.nota_pelunasan[0]?.no_nota || ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Total Harga"
                        disabled
                        variant="bordered"
                        value={detailsData.nota_pelunasan[0]?.total_harga || ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Total Pajak"
                        disabled
                        variant="bordered"
                        value={detailsData.nota_pelunasan[0]?.total_pajak || ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Total Harga setelah Pajak"
                        disabled
                        variant="bordered"
                        value={detailsData.nota_pelunasan[0]?.total_semua || ''}
                      />
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
      <CustomFooter />
    </>
  );
}
