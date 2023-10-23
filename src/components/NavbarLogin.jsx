import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Badge, Avatar } from "@nextui-org/react";
import assets from "../assets";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export default function NavbarPage() {
  const logoStyle = {
    width: "200px",
    height: "auto",
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/LoginPage')
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('authToken')
    navigate('/')
  }

  const profile = () => {
    navigate('/ProfilePage')
  }

  const dashboard = () => {
    navigate('/DashboardPage')
  }

  return (
    <Navbar className="bg-slate-800">
      <NavbarBrand>
        <img src={assets.GAHLOGO} alt="Logo" style={logoStyle} />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link onClick={dashboard} style={{ cursor: "pointer" }}>
            Reservasi
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Badge content="!" color="primary" >
          <Avatar
            onClick={profile}
            radius="md"
            size="sm"
            style={{ cursor: "pointer" }}
            src={assets.profilegah}
          />
        </Badge>
        <Button color="primary" variant="flat" onClick={logout}>
          Logout
        </Button>
      </NavbarContent>
    </Navbar>
  );
}