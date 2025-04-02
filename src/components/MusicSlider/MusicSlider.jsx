import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./MusicSlider.css";
import PlaylistCard from "../PlaylistCard/PlaylistCard";
import AlbumCard from "../AlbumCard/AlbumCard";

const MusicSlider = ({ items, type }) => {
  const swiperRef = useRef(null);
  const containerRef = useRef(null);

  const slidePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const slideNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };


  return (
    <div className="slider-container">
      <h2 className="slider-title">
        {
          type === "playlist" ? "Danh sách phát nổi bật"
            : type === 'album' ? "Album hot nhất"
              : "Bài hát hot nhất"
        }
      </h2>
      <div className="slider-wrapper">
        <button className="slider-btn left" onClick={slidePrev}>
          <FaArrowLeft />
        </button>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={2}
          spaceBetween={15}
          freeMode={true}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          modules={[FreeMode]}
          className="mySwiper"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="slide-item">
              {
                type === "playlist" ? (
                  <PlaylistCard
                    title={item.title}
                    image={item.image_path}
                    description={item.name}
                    idPlaylist={item.id}
                  />
                ) : (type === "song") ? (
                  <PlaylistCard
                    title={item.title}
                    image={item.image_path}
                    description={item.user}
                    idSong={item.id}
                  />
                ) :
                  (
                    <AlbumCard
                      title={item.name}
                      image={item.image_path}
                      artist={item.username}
                    />
                  )
              }
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="slider-btn right" onClick={slideNext}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default MusicSlider;