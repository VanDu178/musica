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



  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const handleWheelScroll = (event) => {
  //     event.preventDefault();
  //     if (swiperRef.current) {
  //       swiperRef.current.translate -= event.deltaY;
  //       swiperRef.current.update();
  //     }
  //   };

  //   container.addEventListener("wheel", handleWheelScroll, { passive: false });
  //   return () => container.removeEventListener("wheel", handleWheelScroll);
  // }, []);

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
                      title={item.title}
                      image={item.image}
                      artist={item.artist}
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