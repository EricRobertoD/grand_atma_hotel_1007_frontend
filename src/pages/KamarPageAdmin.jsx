import { useEffect, useState } from "react";
import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import NavbarLogin from "../components/NavbarLogin";
import CustomFooter from "../components/Footer";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";

export default function KamarPageAdmin() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch("http://127.0.0.1:8000/api/kamar", {
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

  useEffect(() => {
    
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter((row) => {
      return row.no_kamar?.toString().toLowerCase().includes(search.trim().toLowerCase()) ||
        row.jenis_kamar?.jenis_kamar?.toLowerCase().includes(search.trim().toLowerCase());
    });
    setFilteredData(filteredData);
  }, [search, data]);

  return <>
    <NavbarLoginAdmin />
    <div className="container mx-auto py-10" >
      <Input className="w-60"
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table className="py-10" >
        <TableHeader>
          <TableColumn>No kamar</TableColumn>
          <TableColumn>Jenis Kamar</TableColumn>
          <TableColumn>Jenis Bed</TableColumn>
          <TableColumn>Detail</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredData.map((row, i) =>
            <TableRow key={row.id_kamar}>
              <TableCell>{row.no_kamar}</TableCell>
              <TableCell>{row.jenis_kamar.jenis_kamar}</TableCell>
              <TableCell>{row.pilih_bed}</TableCell>
              <TableCell>
                <Button color="primary" variant="flat" onPress={onOpen}>
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <CustomFooter />
    <Modal
      size={"2xl"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior={"inside"}
    ><ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modal Title
            </ModalHeader>
            <ModalBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nullam pulvinar risus non risus hendrerit venenatis.
                Pellentesque sit amet hendrerit risus, sed porttitor quam.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nullam pulvinar risus non risus hendrerit venenatis.
                Pellentesque sit amet hendrerit risus, sed porttitor quam.
              </p>
              <p>
                Magna exercitation reprehenderit magna aute tempor cupidatat
                consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                nisi consectetur esse laborum eiusmod pariatur proident Lorem
                eiusmod et. Culpa deserunt nostrud ad veniam.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nullam pulvinar risus non risus hendrerit venenatis.
                Pellentesque sit amet hendrerit risus, sed porttitor quam.
                Magna exercitation reprehenderit magna aute tempor cupidatat
                consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                nisi consectetur esse laborum eiusmod pariatur proident Lorem
                eiusmod et. Culpa deserunt nostrud ad veniam.
              </p>
              <p>
                Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
                duis sit officia eiusmod Lorem aliqua enim laboris do dolor
                eiusmod. Et mollit incididunt nisi consectetur esse laborum
                eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt
                nostrud ad veniam. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Nullam pulvinar risus non risus hendrerit
                venenatis. Pellentesque sit amet hendrerit risus, sed
                porttitor quam. Magna exercitation reprehenderit magna aute
                tempor cupidatat consequat elit dolor adipisicing. Mollit
                dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et
                mollit incididunt nisi consectetur esse laborum eiusmod
                pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
                veniam.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nullam pulvinar risus non risus hendrerit venenatis.
                Pellentesque sit amet hendrerit risus, sed porttitor quam.
              </p>
              <p>
                Magna exercitation reprehenderit magna aute tempor cupidatat
                consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                nisi consectetur esse laborum eiusmod pariatur proident Lorem
                eiusmod et. Culpa deserunt nostrud ad veniam.
              </p>
              <p>
                Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
                duis sit officia eiusmod Lorem aliqua enim laboris do dolor
                eiusmod. Et mollit incididunt nisi consectetur esse laborum
                eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt
                nostrud ad veniam. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Nullam pulvinar risus non risus hendrerit
                venenatis. Pellentesque sit amet hendrerit risus, sed
                porttitor quam. Magna exercitation reprehenderit magna aute
                tempor cupidatat consequat elit dolor adipisicing. Mollit
                dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et
                mollit incididunt nisi consectetur esse laborum eiusmod
                pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
                veniam.
              </p>
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
}
