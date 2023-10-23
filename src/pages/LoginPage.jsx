import { useState } from "react";
import NavbarPage from "../components/Navbar";
import CustomFooter from "../components/Footer";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    };

    fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Authenticated') {
          console.log('Login berhasil');
          localStorage.setItem('authToken', data.data.access_token);
          navigate('/DashboardPage')
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: 'Invalid email or password',
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: 'An error occurred. Please try again.',
        });
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
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link to="/" className="inline-block pt-2" style={{color:"blue"}}>Forget password?</Link>
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

export default LoginPage;