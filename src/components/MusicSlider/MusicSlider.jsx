import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./MusicSlider.css";
import PlaylistCard from "../PlaylistCard/PlaylistCard";
import AlbumCard from "../AlbumCard/AlbumCard";
import UserCard from "../UserCard/UserCard";
import VideoItem from "../VideoItem/VideoItem";


const MusicSlider = ({ items, type, titleSlider, isHiddenFaArrow, title }) => {
  const swiperRef = useRef(null);
  const slidePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const slideNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <div className="slider-container">
      <h2 className="slider-title">
        {title}
      </h2>
      <h2 className="slider-title">{titleSlider}</h2>

      <div className="slider-wrapper">
        {
          !isHiddenFaArrow && (
            <button className="slider-btn left" onClick={slidePrev}>
              <FaChevronLeft />
            </button>
          )
        }
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
          {items?.map((item, index) => (
            <SwiperSlide key={index} className={`${type === "user" || type === "artist" || type === "video" ? "no-hover" : "slide-item"}`}>              {
              type === "playlists" ? (
                <PlaylistCard
                  image={item.image_path}
                  title={item.name}
                  idPlaylist={item.id}
                />
              ) : (type === "song") ? (
                <PlaylistCard
                  title={item.title}
                  image={item.image_path}
                  description={item.user}
                  idSong={item.id}
                  collab={item.collab_artists}
                />
              ) : (type === "user") ? (
                <UserCard
                  name={item.name}
                  image={item.image_path}
                  role_id={item.role_id}
                  type="user"
                  idUser={item.id}
                  isSlider={true}
                />
              ) : (type === "artist") ? (
                <UserCard
                  name={item.name}
                  image={item.image_path}
                  role_id={item.role_id}
                  type="artist"
                  idUser={item.id}
                  isSlider={true}
                />
              ) :
                (type === "video") ? (
                  <VideoItem
                    video={item}
                  // name={item.name}
                  // image={item.image_path}
                  // role_id={item.role_id}
                  // type="artist"
                  // idUser={item.id}
                  // isSlider={true}
                  />
                ) :
                  (
                    <AlbumCard
                      title={item.name}
                      image={item.image_path}
                      artist={item.username}
                      idAlbum={item.id}
                    />
                  )
            }
            </SwiperSlide>
          ))}
        </Swiper>
        {
          !isHiddenFaArrow && (
            <button className="slider-btn right" onClick={slideNext}>
              <FaChevronRight />
            </button>
          )
        }
      </div>
    </div>
  );
};

export default MusicSlider;