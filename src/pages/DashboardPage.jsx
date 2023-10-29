import { useEffect, useState } from "react";
import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, AccordionItem, Accordion } from "@nextui-org/react";
import NavbarLogin from "../components/NavbarLogin";
import CustomFooter from "../components/Footer";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [reservasi, setReservasi] = useState(null); // Store selected reservation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch("http://127.0.0.1:8000/api/reservasi", {
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
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter((row) => {
      return row.id_booking?.toLowerCase().includes(search.trim().toLowerCase());
    });
    setFilteredData(filteredData);
  }, [search, data]);

  return (
    <>
      <NavbarLogin />
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
            <TableColumn>Jmlh Dewasa</TableColumn>
            <TableColumn>Jmlh anak</TableColumn>
            <TableColumn>Permintaan khusus</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Detail</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id_reservasi}>
                <TableCell>{row.id_booking}</TableCell>
                <TableCell>{row.tanggal_reservasi}</TableCell>
                <TableCell>{row.tanggal_checkin}</TableCell>
                <TableCell>{row.tanggal_checkout}</TableCell>
                <TableCell>{row.dewasa}</TableCell>
                <TableCell>{row.anak}</TableCell>
                <TableCell>{row.permintaan_khusus}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => {
                      setReservasi(row); // Set the selected reservation
                      onOpen(); // Open the modal
                    }}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
                        value={reservasi ? reservasi.id_booking : ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Tanggal Reservasi"
                        disabled
                        variant="bordered"
                        value={reservasi ? reservasi.tanggal_reservasi : ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Tanggal Check In"
                        disabled
                        variant="bordered"
                        value={reservasi ? reservasi.tanggal_checkin : ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Tanggal Check Out"
                        disabled
                        variant="bordered"
                        value={reservasi ? reservasi.tanggal_checkout : ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Status"
                        disabled
                        variant="bordered"
                        value={reservasi ? reservasi.status : ''}
                      />
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label="Accordion 2"
                    subtitle="Tekan untuk detail"
                    title="Detail Kamar"
                  >
                    <div className="col-span-1">
                      <Input
                        label="Jenis Kamar"
                        disabled
                        variant="bordered"
                        value={reservasi.transaksi_kamar[0]?.kamar?.jenis_kamar?.jenis_kamar || ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Jenis Bed"
                        disabled
                        variant="bordered"
                        value={reservasi.transaksi_kamar[0]?.kamar?.pilih_bed || ''}
                      />
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
                        value={reservasi.nota_pelunasan[0]?.no_nota || ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Total Harga"
                        disabled
                        variant="bordered"
                        value={reservasi.nota_pelunasan[0]?.total_harga || ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Total Pajak"
                        disabled
                        variant="bordered"
                        value={reservasi.nota_pelunasan[0]?.total_pajak || ''}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="Total Harga setelah Pajak"
                        disabled
                        variant="bordered"
                        value={reservasi.nota_pelunasan[0]?.total_semua || ''}
                      />
                    </div>
                  </AccordionItem>
                </Accordion>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}