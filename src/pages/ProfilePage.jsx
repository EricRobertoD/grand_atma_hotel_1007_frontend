import { useDisclosure, Card, Button, Avatar, Input, Modal, ModalFooter, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { useState, useEffect } from "react";
import assets from "../assets";
import NavbarLogin from "../components/NavbarLogin";
import { toast } from "react-toastify";
import { BiSolidMessageSquareEdit } from 'react-icons/bi';
import Swal from 'sweetalert2';

function ProfilePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isConfirmationOpenEdit, setIsConfirmationOpenEdit] = useState(false);
  const [customer, setCustomer] = useState({
    username: "",
    nama: "",
    email: "",
    no_telp: "",
    no_identitas: "",
  });
  const [password, setPassword] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const showConfirmationEdit = () => {
    setIsConfirmationOpenEdit(true);
  };
  const hideConfirmationEdit = () => {
    setIsConfirmationOpenEdit(false);
  };

  const fetchCustomerData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("http://127.0.0.1:8000/api/customer", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomer(data.data[0]);
      } else {
        console.error("Failed to fetch customer data");
      }
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      // const updateCustomer = {
      //   username: customer.username,
      //   nama: customer.nama,
      //   email: customer.email,
      //   no_telp: customer.no_telp,
      //   no_identitas: customer.no_identitas,
      // };

      const response = await fetch("http://127.0.0.1:8000/api/customer", {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
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
        toast('🤡Fail to update!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        console.error("Failed to update customer data");
      }
    } catch (error) {
      console.error("Failed to update customer data:", error);
    }
  };

  const changePassword = async () => {
    const authToken = localStorage.getItem("authToken");
      await fetch("http://127.0.0.1:8000/api/changePassword", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', // Add content type
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(password),
      }).then((response) => response.json())
      .then((data) => {
        Swal.close();
  
        if (data.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Change Password Successful',
              text: 'You have successfully change password',
            });    
          console.log('Change Password successful');
        } else {
          console.log('Change Password failed');
  
          if (data.errors) {
            const errorMessages = Object.values(data.errors).join('\n');
            Swal.fire({
              icon: 'error',
              title: 'Change Password Failed',
              text: errorMessages,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Change Password Failed',
              text: 'Please check the password details.',
            });
          }
        }
      })
      .catch((error) => {
        // Hide loading spinner on error
        Swal.close();
        console.error('Error:', error);
      })
      .finally(() => {
        
    setPassword({
      current_password: "",
      password: "",
      password_confirmation: "",
    });
  });
    };
  const handleCancel = () => {
    // Reset the form and exit editing mode
    fetchCustomerData();
    setIsEditing(false);
  };

  return <>
      <NavbarLogin />
      <div className="container mx-auto py-10 " >
      <Card className="px-10 py-10">
        <div className="flex justify-center">
        <Avatar size="lg" className="w-48 h-48" src={assets.profilegah} />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-10">

          <div className="col-span-1" >
            <Input 
            label="Username"
            disabled={!isEditing}
            variant="bordered"
            value={customer.username}
            onChange={(e) => setCustomer({ ...customer, username: e.target.value })}
          />
          </div>
          <div className="col-span-1">
            <Input
            label="Nama"
            disabled={!isEditing}
            variant="bordered"
            value={customer.nama}
            onChange={(e) => setCustomer({ ...customer, nama: e.target.value })}
          />
          </div>
          <div className="col-span-1">
            <Input
            label="Email"
            disabled={!isEditing}
            variant="bordered"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          />
          </div>
          <div className="col-span-1">
          <Input
            label="No Telp"
            disabled={!isEditing}
            variant="bordered"
            value={customer.no_telp}
            onChange={(e) => setCustomer({ ...customer, no_telp: e.target.value })}
          />
          </div>
          <div className="col-span-1">
          <Input
            label="No Identitas"
            disabled={!isEditing}
            variant="bordered"
            value={customer.no_identitas}
            onChange={(e) => setCustomer({ ...customer, no_identitas: e.target.value })}
          />
          </div>
        </div>
          

        {isEditing ? (
          <div>
            <Button color="primary" onPress={showConfirmationEdit}>Save</Button>
            <Button className="mt-10" color="danger" variant="light" onPress={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={handleEdit} className="absolute right-5 top-5" variant="primary">
            <BiSolidMessageSquareEdit className="w-28 h-28"/>
          </Button>
        )}
        <Button onClick={onOpen} className="absolute left-5 top-5" variant="flat">
          ChangePassword
        </Button>
      </Card>
    </div>
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
            handleSave();
          }}>
            Confirm Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <Modal
      size={"2xl"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior={"inside"}
    ><ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              ChangePassword
            </ModalHeader>
            <ModalBody>
            <div className="col-span-1">
            <Input
              type="password"
            label="Current Password"
            variant="bordered"
            value={password.current_password}
            onChange={(e) => setPassword({ ...password, current_password: e.target.value })}
          />
          </div>
          <div className="col-span-1">
          <Input
              type="password"
            label="New Password"
            variant="bordered"
            value={password.password}
            onChange={(e) => setPassword({ ...password, password: e.target.value })}
          />
          </div>
          <div className="col-span-1">
          <Input
              type="password"
            label="Confirm Password"
            variant="bordered"
            value={password.password_confirmation}
            onChange={(e) => setPassword({ ...password, password_confirmation: e.target.value })}
          />
          </div>
                
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={changePassword}>
                Change
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  </>
}

export default ProfilePage;
