import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import assets from "../assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function NavbarAdmin() {
  const logoStyle = {
    width: "200px",
    height: "auto", 
    cursor: "pointer",
  };
  const navigate = useNavigate();
  
  const login = ()=>{
    navigate('/LoginPageAdmin')
  }

  return (
    <Navbar className="bg-slate-800">
      <NavbarBrand >
        <Link to = "/">
        <img src={assets.GAHLOGO} alt="Logo" style={logoStyle} />
           </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <Button color="primary" variant="flat" onClick={login}>
            Login
          </Button>
      </NavbarContent>
    </Navbar>
  );
}