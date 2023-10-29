import { useEffect, useState } from "react";
import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card } from "@nextui-org/react";
import CustomFooter from "../components/Footer";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";
import Swal from "sweetalert2";

export default function FasilitasTambahanPage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isEditing, setIsEditing] = useState(false);
    const [fasilitasToDelete, setFasilitasToDelete] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingFasilitas, setEditingFasilitas] = useState({
        fasilitas_tambahan: "",
        tarif: "",
        satuan: "",
    });
    const [fasilitas, setFasilitas] = useState({
        fasilitas_tambahan: "",
        tarif: "",
        satuan: "",
    });


    const fetchData = async () => {
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
            setData(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const createFasilitas = () => {
        Swal.showLoading();
        const authToken = localStorage.getItem("authToken");
        fetch('http://127.0.0.1:8000/api/fasilitasTambahan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(fasilitas),
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Created Fasilitas Tambahan Successful',
                        text: 'You have Created Fasilitas Tambahan',
                    });
                    console.log('Create Fasilitas Tambahan successful');
                    fetchData();
                    setFasilitas({
                        fasilitas_tambahan: "",
                        tarif: "",
                        satuan: "",
                    });
                } else {
                    console.log('Create Fasilitas Tambahan failed');

                    if (data.errors) {
                        const errorMessages = Object.values(data.errors).join('\n');
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

    const editFasilitas = () => {
        Swal.showLoading();
        const authToken = localStorage.getItem("authToken");
        fetch(`http://127.0.0.1:8000/api/fasilitasTambahan/${editingFasilitas.id_fasilitas}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(editingFasilitas), // Use editingFasilitas data
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Edit Fasilitas Tambahan Successful',
                        text: 'You have edited Fasilitas Tambahan',
                    });
                    console.log('Edit Fasilitas Tambahan successful');
                    fetchData();
                    setEditingFasilitas({ // Reset the edit form data
                        fasilitas_tambahan: "",
                        tarif: "",
                        satuan: "",
                    });
                } else {
                    console.log('Edit Fasilitas Tambahan failed');

                    if (data.errors) {
                        const errorMessages = Object.values(data.errors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: 'Edit Fasilitas Tambahan Failed',
                            text: errorMessages,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Edit Fasilitas Tambahan Failed',
                            text: 'Please check the edit Fasilitas Tambahan details.',
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
        if (fasilitasToDelete) {
            handleDeleteFasilitas(fasilitasToDelete.id_fasilitas);
            setFasilitasToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        deleteOpenChange(false);
        setFasilitasToDelete(null);
    };

    const handleDeleteFasilitas = (id_fasilitas) => {
        Swal.showLoading();
        const authToken = localStorage.getItem("authToken");

        fetch(`http://127.0.0.1:8000/api/fasilitasTambahan/${id_fasilitas}`, {
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
                        title: 'Delete Fasilitas Tambahan Successful',
                        text: 'Fasilitas Tambahan has been deleted.',
                    });
                    console.log('Delete Fasilitas Tambahan successful');
                    fetchData();
                } else {
                    console.log('Delete Fasilitas Tambahan failed');
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Fasilitas Tambahan Failed',
                        text: 'Failed to delete Fasilitas Tambahan. Please try again.',
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
                            <TableColumn>Fasilitas Tambahan</TableColumn>
                            <TableColumn>Tarif</TableColumn>
                            <TableColumn>Satuan</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data
                                .filter((row) => row.fasilitas_tambahan.toLowerCase().includes(search.trim().toLowerCase()) ||
                                    row.satuan.toLowerCase().includes(search.trim().toLowerCase())
                                )
                                .map((row) => (
                                    <TableRow key={row.id_fasilitas}>
                                        <TableCell>{row.fasilitas_tambahan}</TableCell>
                                        <TableCell>{row.tarif}</TableCell>
                                        <TableCell>{row.satuan}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                variant="flat"
                                                onPress={() => {
                                                    setEditingFasilitas(row);
                                                    setIsEditing(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color="danger"
                                                variant="flat"
                                                onClick={() => { setFasilitasToDelete(row); deleteOpenChange(true); }}
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
            ><ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Create Fasilitas
                            </ModalHeader>
                            <ModalBody>
                                <div className="col-span-1">
                                    <Input
                                        type="text"
                                        label="Fasilitas Tambahan"
                                        variant="bordered"
                                        value={fasilitas.fasilitas_tambahan}
                                        onChange={(e) => setFasilitas({ ...fasilitas, fasilitas_tambahan: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Input
                                        type="text"
                                        label="Tarif"
                                        variant="bordered"
                                        value={fasilitas.tarif}
                                        onChange={(e) => setFasilitas({ ...fasilitas, tarif: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Input
                                        type="text"
                                        label="Satuan"
                                        variant="bordered"
                                        value={fasilitas.satuan}
                                        onChange={(e) => setFasilitas({ ...fasilitas, satuan: e.target.value })}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={() => {
                                    onClose();
                                    setFasilitas({
                                        fasilitas_tambahan: "",
                                        tarif: "",
                                        satuan: "",
                                    });
                                }}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={createFasilitas}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
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
                        Are you sure you want to delete this Fasilitas?
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
                    <ModalHeader className="flex flex-col gap-1">Edit Fasilitas Tambahan</ModalHeader>
                    <ModalBody>
                        <Input
                            type="text"
                            label="Fasilitas Tambahan"
                            variant="bordered"
                            value={editingFasilitas.fasilitas_tambahan}
                            onChange={(e) =>
                                setEditingFasilitas({
                                    ...editingFasilitas,
                                    fasilitas_tambahan: e.target.value,
                                })
                            }
                        />

                        <Input
                            type="text"
                            label="Tarif"
                            variant="bordered"
                            value={editingFasilitas.tarif}
                            onChange={(e) =>
                                setEditingFasilitas({
                                    ...editingFasilitas,
                                    tarif: e.target.value,
                                })
                            }
                        />

                        <Input
                            type="text"
                            label="Satuan"
                            variant="bordered"
                            value={editingFasilitas.satuan}
                            onChange={(e) =>
                                setEditingFasilitas({
                                    ...editingFasilitas,
                                    satuan: e.target.value,
                                })
                            }
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => setIsEditing(!isEditing)}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={editFasilitas}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </>
    );
}
