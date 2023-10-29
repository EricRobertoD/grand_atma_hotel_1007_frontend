import { useEffect, useState } from "react";
import { Card, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";
import CustomFooter from "../components/Footer";
import { Input } from "@nextui-org/react";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ReservasiPageAdmin() {
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const handleCreateClick = () => {
        setCreateModalOpen(true);
    };

    const handleCreateClose = () => {
        setCreateModalOpen(false);
    };

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
        no_telp: "",
        no_identitas: "",
        nama: "",
        alamat: "",
        nama_institusi: "",
        jawaban_sq: "",
      });
    

    const [profileData, setProfileData] = useState({
        id_customer: "", 
        nama: "",
        email: "",
        no_telp: "", 
        no_identitas: "",
        alamat: "",
        nama_institusi: "",
      });
    const [detailsData, setDetailsData] = useState(null);


    const handleCreateSubmit = () => {
        Swal.showLoading();
        fetch('http://127.0.0.1:8000/api/registerGrup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Created Customer Successful',
                        text: 'You have Customer Tambahan',
                    });
                    console.log('Create Customer successful');
                    fetchCustomers();
                    setRegisterData({
                        username: "",
                        email: "",
                        password: "",
                        no_telp: "",
                        no_identitas: "",
                        nama: "",
                        alamat: "",
                        nama_institusi: "",
                        jawaban_sq: "",
                    });
                } else {
                    console.log('Create Customer failed');
                    if (data.errors) {
                        const errorMessages = Object.values(data.errors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: 'Create Customer Failed',
                            text: errorMessages,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Create Customer Failed',
                            text: 'Please check the create Customer details.',
                        });
                    }
                }
            })
            .catch((error) => {
                Swal.close();
                console.error('Error:', error);
            });
    };

    const handleEdit = () => {
        setIsEditing(true);
      };
      const handleSaveEdit = () => {
        const authToken = localStorage.getItem("authToken");
        try {
          fetch(`http://127.0.0.1:8000/api/customer/${profileData.id_customer}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(profileData), 
          })
            .then((response) => {
              if (response.ok) {
                fetchCustomers();
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
                console.error("Failed to update Profile");
              }
            })
            .catch((error) => {
              console.error("Failed to update Profile", error);
            });
        } catch (error) {
          console.error("Failed to update Profile", error);
        }
      };
    const fetchCustomers = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch("http://127.0.0.1:8000/api/customerGrup", {
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
            setCustomers(result.data);
        } catch (error) {
            console.error("Error fetching customers: ", error);
        }
    };

    const fetchProfileData = async (customerId) => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`http://127.0.0.1:8000/api/customer/${customerId}`, {
                method: "GET",
                headers: {
                    Accept: "application json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setProfileData(result.data);
        } catch (error) {
            console.error("Error fetching profile data: ", error);
        }
    };

    const fetchDetailsData = async (customerId) => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`http://127.0.0.1:8000/api/reservasi/${customerId}`, {
                method: "GET",
                headers: {
                    Accept: "application json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setDetailsData(result.data);
        } catch (error) {
            console.error("Error fetching details data: ", error);
        }
    };

    const viewProfile = (customer) => {
        setSelectedCustomer(customer);
        setProfileModalOpen(true);
        // Fetch customer profile data when the "Profile" button is clicked
        fetchProfileData(customer.id_customer);
    };

    const viewDetails = (customer) => {
        setSelectedCustomer(customer);
        setDetailsModalOpen(true);
        // Fetch reservation details data when the "Details" button is clicked
        fetchDetailsData(customer.id_customer);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
            <NavbarLoginAdmin />
            <Card className="px-10 py-10">
                <Button
                    onClick={handleCreateClick}
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
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Email</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {customers
                                .filter((customer) => {
                                    const lowerCaseSearch = search.trim().toLowerCase();
                                    return (
                                        customer.nama.toLowerCase().includes(lowerCaseSearch) ||
                                        customer.email.toLowerCase().includes(lowerCaseSearch)
                                    );
                                })
                                .map((customer) => (
                                    <TableRow key={customer.id_customer}>
                                        <TableCell>{customer.nama}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                variant="flat"
                                                onClick={() => viewProfile(customer)}
                                            >
                                                Profile
                                            </Button>
                                            <Button
                                                color="primary"
                                                variant="flat"
                                                onClick={() => viewDetails(customer)}
                                            >
                                                Details
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
                isOpen={profileModalOpen}
                onOpenChange={() => setProfileModalOpen(!profileModalOpen)}
                scrollBehavior={"inside"}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Customer Profile</ModalHeader>
                    <ModalBody>
                        {selectedCustomer && profileData && (
                            <div className="col-span-1">
                                <Input
                                    type="text"
                                    label="Nama"
                                    disabled={!isEditing}
                                    variant="bordered"
                                    value={profileData.nama}
                                    onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                                />
                                <Input
                                    type="text"
                                    label="email"
                                    disabled={!isEditing}
                                    variant="bordered"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                />
                                <Input
                                    type="text"
                                    label="No Telepon"
                                    disabled={!isEditing}
                                    variant="bordered"
                                    value={profileData.no_telp}
                                    onChange={(e) => setProfileData({ ...profileData, no_telp: e.target.value })}
                                />
                                <Input
                                    type="text"
                                    label="No Identitas"
                                    disabled={!isEditing}
                                    variant="bordered"
                                    value={profileData.no_identitas}
                                    onChange={(e) => setProfileData({ ...profileData, no_identitas: e.target.value })}
                                />
                                <Input
                                    type="text"
                                    label="Alamat"
                                    disabled={!isEditing}
                                    variant="bordered"
                                    value={profileData.alamat}
                                    onChange={(e) => setProfileData({ ...profileData, alamat: e.target.value })}
                                />
                                <Input
                                    type="text"
                                    label="Nama Institusi"
                                    disabled={!isEditing}
                                    variant="bordered"
                                    value={profileData.nama_institusi}
                                    onChange={(e) => setProfileData({ ...profileData, nama_institusi: e.target.value })}
                                />
                            </div>
                        )}
                    </ModalBody>
                    
              {isEditing ? (
                <div>
                  <Button onClick={handleSaveEdit} color="primary" className="mt-2 ml-4">Save</Button>
                </div>
              ) : (
                <Button onClick={handleEdit} className="absolute right-10 top-8" variant="primary">
                  <BiSolidMessageSquareEdit className="w-28 h-28" />
                </Button>
              )}
                    <ModalFooter>
                        <Button color="danger" onPress={() => {setProfileModalOpen(false); setIsEditing(false); }}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Reservation Details Modal */}
            <Modal
                size={"2xl"}
                isOpen={detailsModalOpen}
                onOpenChange={() => setDetailsModalOpen(!detailsModalOpen)}
                scrollBehavior={"inside"}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Reservation Details</ModalHeader>
                    <ModalBody>
                        {detailsData && detailsData.map((reservation) => ( //detailsData && berguna untuk mengecek apakah detailsData sudah ada atau belum dan jika belum maka tidak ada masalah, tapi jika tidak mw menggunakan ini, maka harus deklarasi data dengan "" terlebih dahulu agar tidak error
                            <div key={reservation.id_reservasi}>
                                <p>ID Booking: {reservation.id_booking}</p>
                                <p>Tanggal Reservasi: {reservation.tanggal_reservasi}</p>
                                {/* Add more reservation details here */}
                            </div>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={() => setDetailsModalOpen(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal
                size={"2xl"}
                isOpen={isCreateModalOpen}
                onOpenChange={handleCreateClose}
                scrollBehavior={"inside"}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Create Customer</ModalHeader>
                    <ModalBody>
                        
                <div className="col-span-1">
                  <Input
                    type="text"
                    label="Nama"
                    variant="bordered"
                    value={registerData.nama}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, nama: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    label="Username"
                    variant="bordered"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, username: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    label="Email"
                    variant="bordered"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                  />
                  <Input
                    type="password"
                    label="Password"
                    variant="bordered"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    label="Nomor Telepon"
                    variant="bordered"
                    value={registerData.no_telp}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, no_telp: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    label="Nomor Identitas"
                    variant="bordered"
                    value={registerData.no_identitas}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, no_identitas: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    label="Alamat"
                    variant="bordered"
                    value={registerData.alamat}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, alamat: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    label="Nama Institusi"
                    variant="bordered"
                    value={registerData.nama_institusi}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, nama_institusi: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    label="Apa nama hewan peliharaan pertama client?"
                    variant="bordered"
                    value={registerData.jawaban_sq}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, jawaban_sq: e.target.value })
                    }
                  />
                </div>
                        {/* Add more input fields */}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleCreateSubmit}>
                            Create
                        </Button>
                        <Button color="danger" onPress={handleCreateClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
