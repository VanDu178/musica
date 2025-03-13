import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiRepeat } from "react-icons/bi";
import { BsFilePlay } from "react-icons/bs";
import { CgMiniPlayer } from "react-icons/cg";
import { FaExpandAlt, FaPlayCircle, FaStepBackward, FaStepForward, FaVolumeUp } from "react-icons/fa";
import { HiOutlineQueueList } from "react-icons/hi2";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuShuffle } from "react-icons/lu";
import { MdOutlineDevices } from "react-icons/md";
import { TbMicrophone2 } from "react-icons/tb";
import "./Components.css";

const song_title = "Thin song title";
const artist = "Artist";
const song_length = 300;

function timeFormat(seconds) {
  let sec = (seconds % 60);
  let min = Math.floor(seconds / 60);
  return min + ":" + (sec < 10 ? "0" : "") + sec;
}

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState(i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setActiveLang(lng);
  };

  return (
    <footer className="ft-spotify-footer">
      <div className="ft-left com-button-controls com-vertical-align">
        <div className="ft-img_container">
          <img src="https://placehold.co/400/white" alt="Song" />
        </div>
        <div className="ft-song_info com-horizontal-align">
          <h4 title={song_title}>{song_title}</h4>
          <p title={song_title}>{artist}</p>
        </div>
        <button>
          <IoMdAddCircleOutline size={20} color="white" title={t("footer.addToLiked")}/>
        </button>
      </div>

      <div className="ft-center com-horizontal-align">
        <div className="com-button-controls ft-vertical-align">
          <button className="ft-disabled-button" title={t("footer.shuffle")}><LuShuffle color="green" size={20}/></button>
          <button className="ft-disabled-button" title={t("footer.prev")}><FaStepBackward size={20}/></button>
          <button style={{ opacity: 1 }} title={t("footer.play")}><FaPlayCircle size={32} /></button>
          <button title={t("footer.next")}><FaStepForward size={20}/></button>
          <button title={t("footer.repeat")}><BiRepeat size={20}/></button>
        </div>
        <div className="ft-progress-bar">
          <span>0:00</span>
          <input type="range" min="0" max="100" />
          <span>{timeFormat(song_length)}</span>
        </div>
      </div>

      <div className="ft-right com-button-controls com-vertical-align">
        <button><BsFilePlay size={18} /></button>
        <button><TbMicrophone2 size={18} /></button>
        <button><HiOutlineQueueList size={18} /></button>
        <button><MdOutlineDevices size={18} /></button>
        <div className="ft-progress-bar ft-volume-bar com-vertical-align">
          <button><FaVolumeUp size={18} /></button>
          <input type="range" min="0" max="100" />
        </div>
        <button><CgMiniPlayer size={18} /></button>
        <button><FaExpandAlt size={18} /></button>
      </div>
    </footer>
  );
};

export default Footer;