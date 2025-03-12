import React from "react";
import { BiRepeat } from "react-icons/bi";
import { BsFilePlay } from "react-icons/bs";
import { CgMiniPlayer } from "react-icons/cg";
import { FaExpandAlt, FaPlayCircle, FaStepBackward, FaStepForward, FaVolumeUp } from "react-icons/fa";
import { HiOutlineQueueList } from "react-icons/hi2";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuShuffle } from "react-icons/lu";
import { MdOutlineDevices } from "react-icons/md";
import { TbMicrophone2 } from "react-icons/tb";
import "./components.css";

const song_title = "Thin song title";
const artist = "Artist";
const song_length = 300;

function timeFormat(seconds) {
  let sec = (seconds%60);
  let min = Math.floor(seconds/60)
  return min + ":" + ((sec<10)?"0":"") + sec;
}

const Footer = () => {
    return (
      <footer className="spotify-footer">
        <div className="left button-controls vertical-align">
          <div className="img_container">
              <img src="https://placehold.co/400/white" alt="Song" />
          </div>
          <div className="song_info horizontal-align">
            <h4 title={song_title}>{song_title}</h4>
            <p title={song_title}>{artist}</p>
          </div>
          <button>
            <IoMdAddCircleOutline size={20} color="white" title="Add to Liked songs"/>
          </button>
        </div>

        <div className="center horizontal-align">
          <div className="button-controls vertical-align">
            <button className="disabled-button" title="Shuffle"><LuShuffle color="green" size={20}/></button>
            <button className="disabled-button" title="Previous"><FaStepBackward size={20}/></button>
            <button style={{ opacity: 1 }} title="Play"><FaPlayCircle size={32} /></button>
            <button title="Next"><FaStepForward size={20}/></button>
            <button title="Repeat"><BiRepeat size={20}/></button>
          </div>
          <div className="progress-bar">
            <span>0:00</span>
            <input type="range" min="0" max="100" />
            <span>{timeFormat(song_length)}</span>
          </div>
        </div>

        <div className="right button-controls vertical-align">
          <button><BsFilePlay size={18}/></button>
          <button><TbMicrophone2 size={18} /></button>
          <button><HiOutlineQueueList size={18} /></button>
          <button><MdOutlineDevices size={18} /></button>
          <div className="progress-bar volume-bar vertical-align">
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