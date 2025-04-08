import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./MusicSlider.css";
import PlaylistCard from "../PlaylistCard/PlaylistCard";
import AlbumCard from "../AlbumCard/AlbumCard";
import { useUserData } from "../../context/UserDataProvider";
import { checkData } from "../../helpers/encryptionHelper";
import UserCard from "../UserCard/UserCard";


const MusicSlider = ({ items, type, titleSlider, isHiddenFaArrow, title }) => {

  const swiperRef = useRef(null);
  const containerRef = useRef(null);

  const { isLoggedIn } = useUserData();
  const [validRole, setValidRole] = useState(true);
  useEffect(() => {
    const fetchRole = async () => {
      if (isLoggedIn) {
        //nếu đang login thì check role phải user không
        const checkedRoleUser = await checkData(3);
        if (checkedRoleUser) {
          setValidRole(true);
        }
      } else {
        //nếu không login thì hiển thị
        setValidRole(true);
      }
    };

    fetchRole();
  }, [isLoggedIn]);

  const slidePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const slideNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  if (!validRole) {
    return null;
  }

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
              <FaArrowLeft />
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
          {items.map((item, index) => (
            <SwiperSlide key={index} className="slide-item">
              {
                type === "playlists" ? (
                  <PlaylistCard
                    title={item.title}
                    image={item.image_path}
                    description={item.name}
                    idPlaylist={item.id}
                  />
                ) : (type === "songs") ? (
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
                  />
                ) : (type === "artist") ? (
                  <UserCard
                    name={item.name}
                    image={item.image_path}
                    role_id={item.role_id}
                    type="artist"
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
              <FaArrowRight />
            </button>
          )
        }
      </div>
    </div>
  );
};

export default MusicSlider;