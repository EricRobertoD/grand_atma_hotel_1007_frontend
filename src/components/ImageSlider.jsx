import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../ImageSlider.css"; // Replace with the correct path
import { Carousel } from "react-responsive-carousel";
import assets from "../assets";

function ImageSlider() {
  const imageStyle = {
    maxHeight: "calc(100vh - 100px)",
    maxWidth: "100%",
  };

  return (
    <Carousel autoPlay infiniteLoop interval={2000}>
      <div>
        <img src={assets.image1} alt="image1" style={imageStyle} />
      </div>
      <div>
        <img src={assets.image2} alt="image2" style={imageStyle} />
      </div>
      <div>
        <img src={assets.image3} alt="image3" style={imageStyle} />
      </div>
    </Carousel>
  );
}

export default ImageSlider;
