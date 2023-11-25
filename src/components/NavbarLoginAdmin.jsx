import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import assets from "../assets";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export default function NavbarLoginAdmin() {
  const id_role = localStorage.getItem("id_role");
  const logoStyle = {
    width: "200px",
    height: "auto",
    cursor: "pointer"
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
  const kamar = () => {
    navigate('/KamarPageAdmin')
  }
  const musim = () => {
    navigate('/MusimPageAdmin')
  }
  const fasilitas = () => {
    navigate('/FasilitasTambahanPageAdmin')
  }
  const tarif = () => {
    navigate('/TarifPageAdmin')
  }
  const customer = () => {
    navigate('/CustomerGrupPageAdmin')
  }
  const transaksi = () => {
    navigate('/TransaksiPageAdmin')
  }
  const pembatalan = () => {
    navigate('/PembatalanPageAdmin')
  }
  const checkin = () => {
    navigate('/CheckInPageAdmin')
  }
  const laporan = () => {
    navigate('/LaporanPageAdmin')
  }

  return (
    <Navbar className="bg-slate-800">
      <NavbarBrand>
        <img src={assets.GAHLOGO} alt="Logo" style={logoStyle} onClick={dashboard}/>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* {(id_role == 1 || id_role == 2 )? ( */}
        {(id_role == 1 )? (
          <NavbarItem isActive>
            <Link onClick={laporan} style={{ cursor: "pointer" }}>
              Laporan
            </Link>
          </NavbarItem>
        ) : null}
        {(id_role == 3 )? (
          <NavbarItem isActive>
            <Link onClick={checkin} style={{ cursor: "pointer" }}>
              Check In
            </Link>
          </NavbarItem>
        ) : null}
        {(id_role == 4 )? (
          <NavbarItem isActive>
            <Link onClick={kamar} style={{ cursor: "pointer" }}>
              Kamar
            </Link>
          </NavbarItem>
        ) : null}
        {(id_role == 5 )? (
          <NavbarItem isActive>
            <Link onClick={fasilitas} style={{ cursor: "pointer" }}>
              Fasilitas Tambahan
            </Link>
          </NavbarItem>
        ) : null}
        {(id_role == 5 )? (
          <NavbarItem isActive>
            <Link onClick={musim} style={{ cursor: "pointer" }}>
              Musim
            </Link>
          </NavbarItem>
        ) : null}
        {(id_role == 5 )? (
          <NavbarItem isActive>
            <Link onClick={tarif} style={{ cursor: "pointer" }}>
              Tarif
            </Link>
          </NavbarItem>
        ) : null}
        {(id_role == 5 )? (
          <NavbarItem isActive>
            <Link onClick={customer} style={{ cursor: "pointer" }}>
              Customer
            </Link>
          </NavbarItem>
        ) : null}
        {(id_role == 5 )? (
          <NavbarItem isActive>
            <Link onClick={transaksi} style={{ cursor: "pointer" }}>
              Transaksi
            </Link>
          </NavbarItem>
        ) : null}
        {(id_role == 5 )? (
          <NavbarItem isActive>
            <Link onClick={pembatalan} style={{ cursor: "pointer" }}>
              Pembatalan
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