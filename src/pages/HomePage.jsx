import NavbarPage from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import JenisKamarSlider from "../components/JenisKamarSlider";
import FooterHome from "../components/FooterHome";

function HomePage() {
  return (
    <div>
      <NavbarPage />
      <ImageSlider/>
      <JenisKamarSlider/>
      <FooterHome/>
    </div>
  );
}

export default HomePage;