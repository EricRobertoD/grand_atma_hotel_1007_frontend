import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { useEffect } from "react";

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './JenisKamarSlider.css';

export default function JenisKamarSlider() {
    
  const [jenisKamar, setJenisKamar] = useState([]);

    const fetchJenisKamarData = async () => {
        try {
          const authToken = localStorage.getItem("authToken");
          const response = await fetch("http://127.0.0.1:8000/api/jenisKamarPublic", {
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
        
        {jenisKamar.map((row, i) => (
        <SwiperSlide key={i}>
          <img src={"http://127.0.0.1:8000/" +row.gambar} />
            <Card>
                <CardHeader>{row.jenis_kamar}</CardHeader>
                
      <CardBody>
        {row.jenis_bed}
      </CardBody>
      <CardBody>
        {row.fasilitas_kamar}
      </CardBody>
            </Card>
        </SwiperSlide>
          ))}
      </Swiper>
  </div>
    </>
  );
}