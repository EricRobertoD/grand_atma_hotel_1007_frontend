
import CustomFooter from "../components/Footer";
import ImageSlider from "../components/ImageSlider";
import NavbarLoginAdmin from "../components/NavbarLoginAdmin";

function DashboardPageAdmin() {
  return (
    <div>
      <NavbarLoginAdmin />
      <ImageSlider/>
      <CustomFooter/>
    </div>
  );
}

export default DashboardPageAdmin;