import { useEffect, useState } from "react";
import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, Select, SelectItem } from "@nextui-org/react";
import CustomFooter from "../components/Footer";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";
import Swal from "sweetalert2";

export default function MusimPageAdmin() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isEditing, setIsEditing] = useState(false);
    const [musimToDelete, setMusimToDelete] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isConfirmationOpenEdit, setIsConfirmationOpenEdit] = useState(false);
    const [jenisMusimSelect, setjenisMusimSelect] = useState("");
    const [jenisEditingMusimSelect, setEditingJenisMusimSelect] = useState("");

    const jenis_musimSelect = [
        { value: 'Promo'},
        { value: 'High Season'},
        ];

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

    const calculateMinimumDate = () => {
        const today = new Date();
        today.setMonth(today.getMonth() + 2);
        const minDate = today.toISOString().split('T')[0];

        return minDate;
    };
    const [editingMusim, setEditingMusim] = useState({
        nama_musim: "",
        jenis_musim: "",
        tanggal_mulai_musim: "",
        tanggal_selesai_musim: "",
    });
    const [musim, setMusim] = useState({
        nama_musim: "",
        jenis_musim: "",
        tanggal_mulai_musim: "",
        tanggal_selesai_musim: "",
    });
    const formatDate = (date) => {
        const dateObj = new Date(date);
        const formatter = new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return formatter.format(dateObj);
    };

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch("http://127.0.0.1:8000/api/musim", {
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

    const createMusim = () => {
        Swal.showLoading();
        const authToken = localStorage.getItem("authToken");
        fetch('http://127.0.0.1:8000/api/musim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(musim),
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Created Musim Successful',
                        text: 'You have created Musim',
                    });
                    console.log('Create Musim successful');
                    fetchData();
                    setMusim({
                        nama_musim: "",
                        jenis_musim: "",
                        tanggal_mulai_musim: "",
                        tanggal_selesai_musim: "",
                    });
                } else {
                    console.log('Create Musim failed');

                    if (data.errors) {
                        const errorMessages = Object.values(data.errors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: 'Create Musim Failed',
                            text: errorMessages,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Create Musim Failed',
                            text: 'Please check the create Musim details.',
                        });
                    }
                }
            })
            .catch((error) => {
                Swal.close();
                console.error('Error:', error);
            });
    };

    const editMusim = () => {
        Swal.showLoading();
        const authToken = localStorage.getItem("authToken");
        fetch(`http://127.0.0.1:8000/api/musim/${editingMusim.id_musim}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(editingMusim),
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Edit Musim Successful',
                        text: 'You have edited Musim',
                    });
                    console.log('Edit Musim successful');
                    fetchData();
                    setEditingMusim({
                        nama_musim: "",
                        jenis_musim: "",
                        tanggal_mulai_musim: "",
                        tanggal_selesai_musim: "",
                    });
                } else {
                    console.log('Edit Musim failed');

                    if (data.errors) {
                        const errorMessages = Object.values(data.errors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: 'Edit Musim Failed',
                            text: errorMessages,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Edit Musim Failed',
                            text: 'Please check the edit Musim details.',
                        });
                    }
                }
            })
            .catch((error) => {
                Swal.close();
                console.error('Error:', error);
            });
    };

    const deleteOpenChange = (value) => {
        setDeleteOpen(value);
    };

    const handleConfirmDelete = () => {
        deleteOpenChange(false);
        if (musimToDelete) {
            handleDeleteMusim(musimToDelete.id_musim);
            setMusimToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        deleteOpenChange(false);
        setMusimToDelete(null);
    };

    const handleDeleteMusim = () => {
        Swal.showLoading();
        const authToken = localStorage.getItem("authToken");

        fetch(`http://127.0.0.1:8000/api/musim/${musimToDelete.id_musim}`, {
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
                        title: 'Delete Musim Successful',
                        text: 'Musim has been deleted.',
                    });
                    console.log('Delete Musim successful');
                    fetchData();
                } else {
                    console.log('Delete Musim failed');
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Musim Failed',
                        text: 'Failed to delete Musim. Please try again.',
                    });
                }
            })
            .catch((error) => {
                Swal.close();
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <NavbarLoginAdmin />
            <Card className="px-10 py-10">
                <Button onClick={onOpen} className="absolute right-20 top-20" color="primary" variant="flat">
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
                            <TableColumn>Nama Musim</TableColumn>
                            <TableColumn>Jenis Musim</TableColumn>
                            <TableColumn>Tanggal Mulai Musim</TableColumn>
                            <TableColumn>Tanggal Selesai Musim</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data
                                .filter((row) => row.jenis_musim.toLowerCase().includes(search.trim().toLowerCase())
                                    || row.nama_musim.toLowerCase().includes(search.trim().toLowerCase()))
                                .map((row) => (
                                    <TableRow key={row.id_musim}>
                                        <TableCell>{row.nama_musim}</TableCell>
                                        <TableCell>{row.jenis_musim}</TableCell>
                                        <TableCell>{formatDate(row.tanggal_mulai_musim)}</TableCell>
                                        <TableCell>{formatDate(row.tanggal_selesai_musim)}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                variant="flat"
                                                onPress={() => {
                                                    setEditingJenisMusimSelect(new Set([row.jenis_musim]))
                                                    setEditingMusim(row);
                                                    setIsEditing(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color="danger"
                                                variant="flat"
                                                onClick={() => { setMusimToDelete(row); deleteOpenChange(true); }}
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
                                Create Musim
                            </ModalHeader>
                            <ModalBody>
                                <div className="col-span-1">
                                    <Input
                                        type="text"
                                        label="Nama Musim"
                                        variant="bordered"
                                        value={musim.nama_musim}
                                        onChange={(e) => setMusim({ ...musim, nama_musim: e.target.value })}
                                    />
                                </div>
                                  <Select
                                    items={jenis_musimSelect}
                                    label="Jenis Musim"
                                    variant="bordered"
                                    selectedKeys={jenisMusimSelect}
                                    onSelectionChange={(e) => {setjenisMusimSelect(e)
                                        const jenis = [...e]
                                        setMusim({ ...musim, jenis_musim: jenis[0] })}
                                    }
                                    >
                                        {(jenis)=>(
                                            <SelectItem key={jenis.value}>{jenis.value}</SelectItem>
                                        )}
                                    </Select>
                                <div className="col-span-1">
                                    <Input
                                        type="date"
                                        label="Tanggal Mulai Musim"
                                        variant="bordered"
                                        value={musim.tanggal_mulai_musim}
                                        onChange={(e) => setMusim({ ...musim, tanggal_mulai_musim: e.target.value })}
                                        min={calculateMinimumDate()}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Input
                                        type="date"
                                        label="Tanggal Selesai Musim"
                                        variant="bordered"
                                        value={musim.tanggal_selesai_musim}
                                        onChange={(e) => setMusim({ ...musim, tanggal_selesai_musim: e.target.value })}
                                        min={calculateMinimumDate()}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={() => {
                                    onClose();
                                    setMusim({
                                        nama_musim: "",
                                        jenis_musim: "",
                                        tanggal_mulai_musim: "",
                                        tanggal_selesai_musim: "",
                                    });
                                }}>
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
          Are you sure you want to Save this Musim?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={hideConfirmation}>
            Cancel
          </Button>
          <Button color="primary" onPress={createMusim}>
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
                        Are you sure you want to delete this Musim?
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
                size="md"
                isOpen={isEditing}
                onOpenChange={() => setIsEditing(!isEditing)}
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Edit Musim</ModalHeader>
                    <ModalBody>
                        <Input
                            type="text"
                            label="Nama Musim"
                            variant="bordered"
                            value={editingMusim.nama_musim}
                            onChange={(e) =>
                                setEditingMusim({
                                    ...editingMusim,
                                    nama_musim: e.target.value,
                                })
                            }
                        />
                        {/* <Card className="max-w-[400px] mt-0">
                                <CardBody variant="bordered" className=" border rounded p-2">Jenis Kamar
                                  <select
                                    value={editingMusim.jenis_musim} 
                                    disabled={!isEditing}
                                    onChange={(e) => setEditingMusim({...editingMusim, jenis_musim: e.target.value })}
                                  >
                                      <option value="Promo">
                                        Promo
                                      </option>
                                      <option value="High Season">
                                        High Season
                                      </option>
                                    
                                  </select>
                                </CardBody>
                              </Card> */}
                              
                              <Select
                                    items={jenis_musimSelect}
                                    label="Jenis Musim"
                                    variant="bordered"
                                    selectedKeys={jenisEditingMusimSelect}
                                    onSelectionChange={(e) => {
                                        setEditingJenisMusimSelect(e)
                                        const jenis = [...e]
                                        setEditingMusim({ ...editingMusim, jenis_musim: jenis[0] })}
                                    }
                                    >
                                        {(jenis)=>(
                                            <SelectItem key={jenis.value}>{jenis.value}</SelectItem>
                                        )}
                                    </Select>
                        <Input
                            type="date"
                            label="Tanggal Mulai Musim"
                            variant="bordered"
                            value={editingMusim.tanggal_mulai_musim}
                            onChange={(e) =>
                                setEditingMusim({
                                    ...editingMusim,
                                    tanggal_mulai_musim: e.target.value,
                                })
                            }
                            min={calculateMinimumDate()}

                        />
                        <Input
                            type="date"
                            label="Tanggal Selesai Musim"
                            variant="bordered"
                            value={editingMusim.tanggal_selesai_musim}
                            onChange={(e) =>
                                setEditingMusim({
                                    ...editingMusim,
                                    tanggal_selesai_musim: e.target.value,
                                })
                            }
                            min={calculateMinimumDate()}
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
            editMusim();
          }}>
            Confirm Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
        </>
    );
}
