import { useState } from "react";
import NavbarPage from "../components/Navbar";
import CustomFooter from "../components/Footer";
import Swal from 'sweetalert2';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jawabansq, setJawabansq] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/DashboardPage')
    }
  }, [])
  const handleLogin = () => {
    const loginData = {
      email: email,
      password: password,
      jawaban_sq: jawabansq,
    };

    fetch('http://127.0.0.1:8000/api/forgetPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          Swal.fire({
              icon: 'success',
              title: 'Changed Password Successful',
              text: 'You have Changed Password Successful',
          });
          console.log('Change forget password successful');
      } else {
          console.log('Changed Password Tambahan failed');

          if (data.errors) {
              const errorMessages = Object.values(data.errors).join('\n');
              Swal.fire({
                  icon: 'error',
                  title: 'Changed Password Failed',
                  text: errorMessages,
              });
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Changed Password Failed',
                  text: 'Please check the Input details.',
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
        <div className="bg-white p-8 rounded shadow-md w-96" >
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">New Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <div className="mb-4">
              <label htmlFor="jawabansq" className="block text-gray-600">Apa nama hewan peliharaan pertamamu?</label>
              <input
                type="text"
                id="jawabansq"
                className="w-full px-3 py-2 border rounded-md"
                value={jawabansq}
                onChange={(e) => setJawabansq(e.target.value)}
              />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
      <CustomFooter />
    </>
  );
};

export default ForgetPasswordPage;