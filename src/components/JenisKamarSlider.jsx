import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './JenisKamarSlider.css';

export default function JenisKamarSlider() {
  const [jenisKamar, setJenisKamar] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const openRoomDetail = (room) => {
    setSelectedRoom(room);
  };
  

  const closeRoomDetail = () => {
    setSelectedRoom(null);
  };

  const fetchJenisKamarData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("https://p3l-be-eric.frederikus.com/api/jenisKamarPublic", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJenisKamar(data.data);
      } else {
        console.error("Failed to fetch jenis kamar data");
      }
    } catch (error) {
      console.error("Failed to fetch jenis kamar data:", error);
    }
  };

  useEffect(() => {
    fetchJenisKamarData();
  }, []);

  return (
    <>
      <div className="h-96 jenis-kamar-slider-container">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper"
        >
          {jenisKamar.map((room, i) => (
            <SwiperSlide key={i}>
              <img src={"https://p3l-be-eric.frederikus.com/" + room.gambar} />
              <Card>
                <CardHeader>{room.jenis_kamar}</CardHeader>
                <CardBody>
                  {room.jenis_bed}
                </CardBody>
                <CardBody>
                  {room.fasilitas_kamar}
                </CardBody>
                <CardBody>
                  <Button onClick={() => openRoomDetail(room)}>Selengkapnya</Button>
                </CardBody>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {selectedRoom && (
        <Modal size="md" className="h-screen" isOpen={!!selectedRoom} onClose={closeRoomDetail}>
  <ModalContent style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <ModalHeader>{selectedRoom.jenis_kamar}</ModalHeader>
            <ModalBody>
              <img src={"https://p3l-be-eric.frederikus.com/" + selectedRoom.gambar} />
              <CardBody>
                
                {selectedRoom.jenis_bed}
              </CardBody>
              <CardBody>
                {selectedRoom.harga_default}
              </CardBody>
              <CardBody>
                {selectedRoom.ukuran_kamar}
              </CardBody>
              <CardBody>
                {selectedRoom.fasilitas_kamar}
              </CardBody>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={closeRoomDetail}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
