import { useState } from "react";
import NavbarPage from "../components/Navbar";
import CustomFooter from "../components/Footer";
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [nama, setNama] = useState('');
  const [address, setAddress] = useState('');
  const [namaInst, setNamaInst] = useState('');
  const [jawabansq, setjawabansq] = useState('');

  const handleRegister = () => {
    Swal.showLoading();
  
    const registerData = {
        username: username,
        email: email,
        password: password,
        no_telp: phone,
        no_identitas: idNumber,
        nama: nama,
        alamat: address,
        nama_institusi: namaInst,
        jawaban_sq: jawabansq,
    };
  
    fetch('http://127.0.0.1:8000/api/register', {
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
              title: 'Registration Successful',
              text: 'You have successfully registered.',
            });    
          console.log('Registration successful');
          setUsername('');
          setEmail('');
          setPassword('');
          setPhone('');
          setIdNumber('');
          setNama('');
          setAddress('');
          setNamaInst('');
          setjawabansq('');
        } else {
          console.log('Registration failed');
  
          if (data.errors) {
            const errorMessages = Object.values(data.errors).join('\n');
            Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: errorMessages,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: 'Please check the registration details.',
            });
          }
        }
      })
      .catch((error) => {
        Swal.close();
        console.error('Error:', error);
      });
  };

  return (
    <>
      <NavbarPage />
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md" style={{ width: '1000px' }}>
          <h2 className="text-2xl font-semibold mb-4">Register</h2>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
            <div>
              <label htmlFor="nama" className="block text-gray-600">
                Nama
              </label>
              <input
                type="text"
                id="nama"
                className="w-full px-3 py-2 border rounded-md"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-gray-600">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                className="w-full px-3 py-2 border rounded-md"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="idNumber" className="block text-gray-600">
                ID Number
              </label>
              <input
                type="text"
                id="idNumber"
                className="w-full px-3 py-2 border rounded-md"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="namaInst" className="block text-gray-600">
                Nama Institusi
              </label>
              <input
                type="text"
                id="namaInst"
                className="w-full px-3 py-2 border rounded-md"
                value={namaInst}
                onChange={(e) => setNamaInst(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-600">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full px-3 py-2 border rounded-md"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-600">
                Apa nama hewan peliharaan pertamamu?
              </label>
              <input
                type="text"
                id="jawabansq"
                className="w-full px-3 py-2 border rounded-md"
                value={jawabansq}
                onChange={(e) => setjawabansq(e.target.value)}
              />
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover-bg-blue-600"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
      <CustomFooter />
    </>
  );
};

export default RegisterPage;
