import { useEffect, useState } from "react";
import { Input, Table, TableHeader, Card, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem, CardBody } from "@nextui-org/react";
import CustomFooter from "../components/Footer";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";
import Swal from 'sweetalert2';
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { toast } from "react-toastify";

export default function KamarPageAdmin() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [kamarToDelete, setKamarToDelete] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKamarDetail, setSelectedKamarDetail] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isConfirmationOpenEdit, setIsConfirmationOpenEdit] = useState(false);

  const [kamar, setKamar] = useState({
    no_kamar: "",
    id_jeniskamar: "",
    pilih_bed: "",
  });
  const [jenisKamar, setjenisKamar] = useState([]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Function to show the confirmation modal
  const showConfirmation = () => {
    setIsConfirmationOpen(true);
  };
  const hideConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const showConfirmationEdit = () => {
    setIsConfirmationOpenEdit(true);
  };
  const hideConfirmationEdit = () => {
    setIsConfirmationOpenEdit(false);
  };

  const handleDetail = (id_kamar) => {
    const authToken = localStorage.getItem("authToken");
    fetch(`https://p3l-be-eric.frederikus.com/api/kamar/${id_kamar}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setSelectedKamarDetail(data.data);
          fetchData();
        } else {
          console.log('Fetch Kamar detail failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  const deleteOpenChange = (value) => {
    setDeleteOpen(value);
  };

  const handleConfirmDelete = () => {
    deleteOpenChange(false);
    if (kamarToDelete) {
      handleDeleteKamar(kamarToDelete.id_kamar);
      setKamarToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    deleteOpenChange(false);
    setKamarToDelete(null);
  };


  const handleDeleteKamar = (id_kamar) => {
    Swal.showLoading();
    const authToken = localStorage.getItem("authToken");

    fetch(`https://p3l-be-eric.frederikus.com/api/kamar/${id_kamar}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.close();

        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Delete Kamar Successful',
            text: 'Kamar has been deleted.',
          });
          console.log('Delete kamar successful');
          fetchData();
        } else {
          console.log('Delete kamar failed');
          Swal.fire({
            icon: 'error',
            title: 'Delete Kamar Failed',
            text: 'Failed to delete Kamar. Please try again.',
          });
        }
      })
      .catch((error) => {
        Swal.close();
        console.error('Error:', error);
      });
  };

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("https://p3l-be-eric.frederikus.com/api/kamar", {
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

  const fetchDataJK = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("https://p3l-be-eric.frederikus.com/api/jenisKamar", {
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
      setjenisKamar(result.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };


  const createKamar = () => {
    Swal.showLoading();
    const authToken = localStorage.getItem("authToken");
    fetch('https://p3l-be-eric.frederikus.com/api/kamar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(kamar),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.close();

        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Created Kamar Successful',
            text: 'You have Created Kamar.',
          });
          console.log('Create kamar successful');
          fetchData();
          setKamar({
            no_kamar: "",
            id_jeniskamar: "",
            pilih_bed: "",
          });
        } else {
          console.log('Create kamar failed');

          if (data.errors) {
            const errorMessages = Object.values(data.errors).join('\n');
            Swal.fire({
              icon: 'error',
              title: 'Create Kamar Failed',
              text: errorMessages,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Create kamar Failed',
              text: 'Please check the create kamar details.',
            });
          }
        }
      })
      .catch((error) => {
        Swal.close();
        console.error('Error:', error);
      });
  };

  const handleSaveEdit = () => {
    const authToken = localStorage.getItem("authToken");
    try {
      fetch(`https://p3l-be-eric.frederikus.com/api/kamar/${selectedKamarDetail.id_kamar}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(selectedKamarDetail),
      })
        .then((response) => {
          if (response.ok) {
            fetchData();
            setIsEditing(false);
            toast('🦄 Updated!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            toast('🤡 Fail to update!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            console.error("Failed to update Kamar data");
          }
        })
        .catch((error) => {
          console.error("Failed to update Kamar data:", error);
        });
    } catch (error) {
      console.error("Failed to update Kamar data:", error);
    }
  };


  useEffect(() => {
    fetchDataJK();
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

      <Card className="px-10 py-10">
        <Input className="w-60"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={onOpen} className="absolute right-20 top-20" color="primary" variant="flat">
          Create
        </Button>
        <Table className="py-10 mt-10" >
          <TableHeader>
            <TableColumn>No kamar</TableColumn>
            <TableColumn>Jenis Kamar</TableColumn>
            <TableColumn>Jenis Bed</TableColumn>
            <TableColumn>Detail</TableColumn>
            <TableColumn>Hapus</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) =>
              <TableRow key={row.id_kamar}>
                <TableCell>{row.no_kamar}</TableCell>
                <TableCell>{row.jenis_kamar.jenis_kamar}</TableCell>
                <TableCell>{row.pilih_bed}</TableCell>
                <TableCell>
                  <Button color="primary" variant="flat" onPress={() => handleDetail(row.id_kamar)}>
                    Detail
                  </Button>
                </TableCell>
                <TableCell>
                  <Button color="danger" variant="flat" onClick={() => { setKamarToDelete(row); deleteOpenChange(true); }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table></Card>
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
              Create Kamar
            </ModalHeader>
            <ModalBody>
              <div className="col-span-1">
                <Input
                  type="text"
                  label="No Kamar"
                  variant="bordered"
                  value={kamar.no_kamar}
                  onChange={(e) => setKamar({ ...kamar, no_kamar: e.target.value })}
                />
              </div>
              <div className="col-span-1">
                <Select
                  type="text"
                  label="Jenis Kamar"
                  variant="bordered"
                  value={kamar.id_jeniskamar}
                  onChange={(e) => setKamar({ ...kamar, id_jeniskamar: e.target.value })}
                >{jenisKamar.map((jk) => (
                  <SelectItem key={jk.id_jeniskamar} value={jk.id_jeniskamar}>
                    {jk.jenis_kamar}
                  </SelectItem>
                ))}
                </Select>
              </div>
              <div className="col-span-1">
                <Select
                  type="text"
                  label="Pilih Bed"
                  variant="bordered"
                  value={kamar.pilih_bed}
                  onChange={(e) => setKamar({ ...kamar, pilih_bed: e.target.value })}
                >
                  <SelectItem value="1 Double" key={"1 Double"}>
                    1 Double
                  </SelectItem>
                  <SelectItem value="1 Twin" key={"1 Twin"}>
                    1 Twin
                  </SelectItem>
                  <SelectItem value="2 Twin" key={"2 Twin"}>
                    2 Twin
                  </SelectItem>
                  <SelectItem value="1 King" key={"1 King"}>
                    1 King
                  </SelectItem>
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={showConfirmation}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    <Modal size="md" isOpen={isConfirmationOpen} onOpenChange={hideConfirmation}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirmation</ModalHeader>
        <ModalBody>
          Are you sure you want to Save this Kamar?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={hideConfirmation}>
            Cancel
          </Button>
          <Button color="primary" onPress={createKamar}>
            Confirm Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <Modal
      size="md"
      isOpen={deleteOpen}
      onOpenChange={deleteOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirmation</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this Kamar?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleCancelDelete}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleConfirmDelete}>
            Confirm Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    <Modal
      size={"2xl"}
      isOpen={selectedKamarDetail !== null}
      onOpenChange={() => setSelectedKamarDetail(null)}
      scrollBehavior={"inside"}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Kamar Detail
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4 pt-10">

                <div className="col-span-1" >
                  <Input
                    label="No Kamar"
                    disabled={!isEditing}
                    variant="bordered"
                    value={selectedKamarDetail.no_kamar}
                    onChange={(e) => setSelectedKamarDetail({ ...selectedKamarDetail, no_kamar: e.target.value })}
                  />
                  <Card className="max-w-[400px] mt-4" >
                    <CardBody variant="bordered" className="border rounded p-2" >
                      Bed
                      <select
                        value={selectedKamarDetail.pilih_bed}
                        disabled={!isEditing}
                        onChange={(e) => setSelectedKamarDetail({ ...selectedKamarDetail, pilih_bed: e.target.value })} // Use e.target.value directly
                      >
                        <option value="1 Double" key={"1 Double"}>
                          1 Double
                        </option>
                        <option value="1 Twin" key={"1 Twin"}>
                          1 Twin
                        </option>
                        <option value="2 Twin" key={"2 Twin"}>
                          2 Twin
                        </option>
                        <option value="1 King" key={"1 King"}>
                          1 King
                        </option>
                      </select>
                    </CardBody>
                  </Card>
                  <Card className="max-w-[400px] mt-4">
                    <CardBody variant="bordered" className=" border rounded p-2">Jenis Kamar
                      <select
                        value={selectedKamarDetail.jenis_kamar.id_jeniskamar}
                        disabled={!isEditing}
                        onChange={(e) => setSelectedKamarDetail({ ...selectedKamarDetail, jenis_kamar: { id_jeniskamar: e.target.value } })}
                      >
                        {jenisKamar.map((jk) => (
                          <option key={jk.id_jeniskamar} value={jk.id_jeniskamar}>
                            {jk.jenis_kamar}
                          </option>
                        ))}
                      </select>
                    </CardBody>
                  </Card>
                </div>
              </div>
              {isEditing ? (
                <div>
                  <Button onClick={showConfirmationEdit}>Save</Button>
                </div>
              ) : (
                <Button onClick={handleEdit} className="absolute right-10 top-10" variant="primary">
                  <BiSolidMessageSquareEdit className="w-28 h-28" />
                </Button>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => {
                onClose();
                setIsEditing(false);
              }}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    <Modal size="md" isOpen={isConfirmationOpenEdit} onOpenChange={hideConfirmationEdit}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirmation</ModalHeader>
        <ModalBody>
          Are you sure you want to Edit this Kamar?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={() => {
            hideConfirmationEdit();
            setIsEditing(false);
          }}>
            Cancel
          </Button>
          <Button color="primary" variant="light" onPress={() => {
            hideConfirmationEdit();
            setIsEditing(false);
            handleSaveEdit();
          }}>
            Confirm Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
}
