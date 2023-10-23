import NavbarPage from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import JenisKamarSlider from "../components/jenisKamarSlider";

function HomePage() {
  return (
    <div>
      <NavbarPage />
      <ImageSlider/>
      <JenisKamarSlider/>
    </div>
  );
}

export default HomePage;