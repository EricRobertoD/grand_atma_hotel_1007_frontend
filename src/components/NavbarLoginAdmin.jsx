import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Badge, Avatar } from "@nextui-org/react";
import assets from "../assets";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export default function NavbarLoginAdmin() {
  const id_role = localStorage.getItem("id_role");
  const logoStyle = {
    width: "200px",
    height: "auto",
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/LoginPageAdmin')
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('authToken')
    navigate('/LoginPageAdmin')
  }


  const dashboard = () => {
    navigate('/DashboardPageAdmin')
  }

  return (
    <Navbar className="bg-slate-800">
      <NavbarBrand>
        <img src={assets.GAHLOGO} alt="Logo" style={logoStyle} />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* {(id_role == 1 || id_role == 2 )? ( */}
        {(id_role == 1 )? (
          <NavbarItem isActive>
            <Link onClick={dashboard} style={{ cursor: "pointer" }}>
              Reservasi
            </Link>
          </NavbarItem>
        ) : null}
        {(id_role == 2 )? (
          <NavbarItem isActive>
            <Link onClick={dashboard} style={{ cursor: "pointer" }}>
              Reservasi2
            </Link>
          </NavbarItem>
        ) : null}
      </NavbarContent>
      <NavbarContent justify="end">
        <Button color="primary" variant="flat" onClick={logout}>
          Logout
        </Button>
      </NavbarContent>
    </Navbar>
  );
}