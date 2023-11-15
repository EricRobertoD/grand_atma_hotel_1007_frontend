import { useEffect, useState } from "react";
import {Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, Select, SelectItem, CardBody,} from "@nextui-org/react";
import Swal from "sweetalert2";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";
import CustomFooter from "../components/Footer";

export default function TarifMusimPageAdmin() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [tarifMusimToDelete, setTarifMusimToDelete] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [jenisKamar, setjenisKamar] = useState([]);
  const [jenisMusim, setjenisMusim] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isConfirmationOpenEdit, setIsConfirmationOpenEdit] = useState(false);
  const [editingTarifMusim, setEditingTarifMusim] = useState({
    id_jeniskamar: "",
    id_musim: "",
    tarif_musim: "",
  });
  const [tarifMusim, setTarifMusim] = useState({
    id_jeniskamar: "",
    id_musim: "",
    tarif_musim: "",
  });

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

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("https://p3l-be-eric.frederikus.com/api/tarifMusim", {
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

  const fetchDataMS = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("https://p3l-be-eric.frederikus.com/api/musim", {
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
      setjenisMusim(result.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const createTarifMusim = () => {
    Swal.showLoading();
    const authToken = localStorage.getItem("authToken");
    fetch("https://p3l-be-eric.frederikus.com/api/tarifMusim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(tarifMusim),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.close();

        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Created Tarif Musim Successful",
            text: "You have Created Tarif Musim",
          });
          console.log("Create Tarif Musim successful");
          fetchData();
          setTarifMusim({
            id_jeniskamar: "",
            id_musim: "",
            tarif_musim: "",
          });
        } else {
          console.log("Create Tarif Musim failed");
          
          setTarifMusim({
            id_jeniskamar: "",
            id_musim: "",
            tarif_musim: "",
          });

          if (data.errors) {
            const errorMessages = Object.values(data.errors).join("\n");
            Swal.fire({
              icon: "error",
              title: "Create Tarif Musim Failed",
              text: errorMessages,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Create Tarif Musim Failed",
              text: "Please check the create Tarif Musim details.",
            });
          }
        }
      })
      .catch((error) => {
        Swal.close();
        console.error("Error:", error);
      });
  };

  

  const editTarifMusim = () => {
    Swal.showLoading();
    const authToken = localStorage.getItem("authToken");
    fetch(`https://p3l-be-eric.frederikus.com/api/tarifMusim/${editingTarifMusim.id_tarifmusim}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(editingTarifMusim), // Use editingTarifMusim data
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.close();

        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Edit Tarif Musim Successful",
            text: "You have edited Tarif Musim",
          });
          console.log("Edit Tarif Musim successful");
          fetchData();
          setEditingTarifMusim({
            id_jeniskamar: "",
            id_musim: "",
            tarif_musim: "",
          });
        } else {
          console.log("Edit Tarif Musim failed");

          if (data.errors) {
            const errorMessages = Object.values(data.errors).join("\n");
            Swal.fire({
              icon: "error",
              title: "Edit Tarif Musim Failed",
              text: errorMessages,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Edit Tarif Musim Failed",
              text: "Please check the edit Tarif Musim details.",
            });
          }
        }
      })
      .catch((error) => {
        Swal.close();
        console.error("Error:", error);
      });
  };

  const deleteOpenChange = (value) => {
    setDeleteOpen(value);
  };

  const handleConfirmDelete = () => {
    deleteOpenChange(false);
    if (tarifMusimToDelete) {
      handleDeleteTarifMusim(tarifMusimToDelete.id_tarifmusim);
      setTarifMusimToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    deleteOpenChange(false);
    setTarifMusimToDelete(null);
  };

  const handleDeleteTarifMusim = (id) => {
    Swal.showLoading();
    const authToken = localStorage.getItem("authToken");

    fetch(`https://p3l-be-eric.frederikus.com/api/tarifMusim/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.close();

        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Delete Tarif Musim Successful",
            text: "Tarif Musim has been deleted.",
          });
          console.log("Delete Tarif Musim successful");
          fetchData();
        } else {
          console.log("Delete Tarif Musim failed");
          Swal.fire({
            icon: "error",
            title: "Delete Tarif Musim Failed",
            text: "Failed to delete Tarif Musim. Please try again.",
          });
        }
      })
      .catch((error) => {
        Swal.close();
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchDataMS();
    fetchDataJK();
  }, []);

  return (
    <>
    <NavbarLoginAdmin />
      <Card className="px-10 py-10">
        <Button
          onClick={onOpen}
          className="absolute right-20 top-20"
          color="primary"
          variant="flat"
        >
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
              <TableColumn>Jenis Kamar</TableColumn>
              <TableColumn>Musim</TableColumn>
              <TableColumn>Tarif Musim</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {data
                .filter(
                  (row) =>
                    row.jenis_kamar.jenis_kamar
                      .toString()
                      .toLowerCase()
                      .includes(search.trim().toLowerCase()) ||
                    row.musim.nama_musim
                      .toString()
                      .toLowerCase()
                      .includes(search.trim().toLowerCase()) ||
                    row.tarif_musim
                      .toString()
                      .toLowerCase()
                      .includes(search.trim().toLowerCase())
                )
                .map((row) => (
                  <TableRow key={row.id_tarifmusim}>
                    <TableCell>{row.jenis_kamar.jenis_kamar}</TableCell>
                    <TableCell>{row.musim.nama_musim}</TableCell>
                    <TableCell>{row.tarif_musim}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={() => {
                          setEditingTarifMusim(row);
                          setIsEditing(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        variant="flat"
                        onClick={() => {
                          setTarifMusimToDelete(row);
                          deleteOpenChange(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
            <CustomFooter/>
      <Modal
        size={"2xl"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Tarif Musim</ModalHeader>
              <ModalBody>
              <div className="col-span-1">
                <Select
                  type="text"
                  label="Jenis Kamar"
                  variant="bordered"
                  value={tarifMusim.id_jeniskamar}
                  onChange={(e) => setTarifMusim({ ...tarifMusim, id_jeniskamar: e.target.value })}
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
                  label="Musim"
                  variant="bordered"
                  value={tarifMusim.id_musim}
                  onChange={(e) => setTarifMusim({ ...tarifMusim, id_musim: e.target.value })}
                >{jenisMusim.map((jk) => (
                  <SelectItem key={jk.id_musim} value={jk.id_musim}>
                    {jk.nama_musim}
                  </SelectItem>
                ))}
                </Select>
              </div>
                <div className="col-span-1">
                  <Input
                    type="text"
                    label="Tarif Musim"
                    variant="bordered"
                    value={tarifMusim.tarif_musim}
                    onChange={(e) =>
                      setTarifMusim({ ...tarifMusim, tarif_musim: e.target.value })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setTarifMusim({
                      id_jeniskamar: "",
                      id_musim: "",
                      tarif_musim: "",
                    });
                  }}
                >
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
          Are you sure you want to Save this Tarif?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={hideConfirmation}>
            Cancel
          </Button>
          <Button color="primary" onPress={createTarifMusim}>
            Confirm Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
      <Modal size="md" isOpen={deleteOpen} onOpenChange={deleteOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Confirmation</ModalHeader>
          <ModalBody>Are you sure you want to delete this ?</ModalBody>
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
      <Modal size="md" isOpen={isEditing} onOpenChange={() => setIsEditing(!isEditing)} scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Edit Tarif Musim</ModalHeader>
          <ModalBody>
            <Card className="max-w-[400px] mt-4">
                    <CardBody variant="bordered" className=" border rounded p-2">Jenis Kamar
                      <select
                        value={editingTarifMusim.id_jeniskamar} 
                        disabled={!isEditing}
                        onChange={(e) => setEditingTarifMusim({...editingTarifMusim, id_jeniskamar: e.target.value })}
                      >
                        {jenisKamar.map((jk) => (
                          <option key={jk.id_jeniskamar} value={jk.id_jeniskamar}>
                            {jk.jenis_kamar}
                          </option>
                        ))}
                      </select>
                    </CardBody>
                  </Card>

                  <Card className="max-w-[400px] mt-4">
                    <CardBody variant="bordered" className=" border rounded p-2">Jenis Kamar
                      <select
                        value={editingTarifMusim.id_musim} 
                        disabled={!isEditing}
                        onChange={(e) => setEditingTarifMusim({...editingTarifMusim, id_musim: e.target.value })}
                      >
                        {jenisMusim.map((jk) => (
                          <option key={jk.id_musim} value={jk.id_musim}>
                            {jk.nama_musim}
                          </option>
                        ))}
                      </select>
                    </CardBody>
                  </Card>

            <Input
              type="text"
              label="Tarif Musim"
              variant="bordered"
              value={editingTarifMusim.tarif_musim}
              onChange={(e) =>
                setEditingTarifMusim({
                  ...editingTarifMusim,
                  tarif_musim: e.target.value,
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsEditing(!isEditing)}>
              Cancel
            </Button>
            <Button color="primary" onPress={showConfirmationEdit}>
              Save
            </Button>
          </ModalFooter>
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
            editTarifMusim();
          }}>
            Confirm Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}
