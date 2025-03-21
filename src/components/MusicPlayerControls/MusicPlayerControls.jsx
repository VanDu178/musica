import React, { useRef, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { BiRepeat } from "react-icons/bi";
import { BsFilePlay } from "react-icons/bs";
import { CgMiniPlayer } from "react-icons/cg";
import { FaExpandAlt, FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward, FaVolumeUp } from "react-icons/fa";
import { HiOutlineQueueList } from "react-icons/hi2";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuShuffle } from "react-icons/lu";
import { MdOutlineDevices } from "react-icons/md";
import { TbMicrophone2 } from "react-icons/tb";
import axiosInstance from "../../config/axiosConfig";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import "./MusicPlayerControl.css";

const MusicPlayerControl = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Sử dụng useNavigate
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [song, setSong] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);

  // Hàm fetch dữ liệu bài hát
  const fetchSongDetails = async (songId) => {
    try {
      const response = await axiosInstance.get(`/song/${songId}/`);
      if (response.status === 200) {
        setSong(response.data);
        if (audioRef.current) {
          audioRef.current.src = response.data.mp3_path; // Đường dẫn src của file âm thanh
        }
      }
    } catch (error) {
      console.error("Error fetching song details:", error);
    }
  };

  // Gọi hàm fetch dữ liệu khi component mount
  useEffect(() => {
    const songId = 52; // Thay bằng ID bài hát thực tế
    fetchSongDetails(songId);
  }, []);

  // Xử lý Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Xử lý khi bài hát kết thúc
  const handleSongEnd = () => {
    console.log("Bài hát đã kết thúc");
    // Thêm logic để phát bài hát tiếp theo ở đây
  };

  // Cập nhật tiến trình bài hát
  useEffect(() => {
    const updateTime = () => setCurrentTime(audioRef.current.currentTime);
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateTime);
      audioRef.current.addEventListener("ended", handleSongEnd);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateTime);
        audioRef.current.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [audioRef.current]);

  // Xử lý Seek (kéo thanh tiến trình)
  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * song.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Xử lý Volume
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
  };

  // Định dạng thời gian (phút:giây)
  const timeFormat = (seconds) => {
    let sec = Math.floor(seconds % 60);
    let min = Math.floor(seconds / 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Hàm điều hướng đến trang đăng nhập
  const handleSignUpClick = () => {
    navigate("/login");
  };

  return (
    <footer className="ft-spotify-footer">
      {isLoggedIn ? (
        song ? (
          <>
            {/* Phần hiển thị bài hát */}
            <div className="ft-left com-button-controls com-vertical-align">
              <div className="ft-img_container">
                <img src={song.image_path} alt="Song" /> {/* Đường dẫn hình ảnh */}
              </div>
              <div className="ft-song_info com-horizontal-align">
                <h4 title={song.title}>{song.title}</h4>
                <p title={song.artist}>{song.artist}</p>
              </div>
              <button>
                <IoMdAddCircleOutline size={20} color="white" title={t("footer.addToLiked")} />
              </button>
            </div>

            {/* Phần điều khiển nhạc */}
            <div className="ft-center com-horizontal-align">
              <div className="com-button-controls ft-vertical-align">
                <button className="ft-disabled-button" title={t("footer.shuffle")}>
                  <LuShuffle color="green" size={20} />
                </button>
                <button className="ft-disabled-button" title={t("footer.prev")}>
                  <FaStepBackward size={20} />
                </button>
                <button onClick={togglePlay} title={t("footer.play")}>
                  {isPlaying ? <FaPauseCircle size={32} /> : <FaPlayCircle size={32} />}
                </button>
                <button title={t("footer.next")}>
                  <FaStepForward size={20} />
                </button>
                <button title={t("footer.repeat")}>
                  <BiRepeat size={20} />
                </button>
              </div>

              {/* Thanh tiến trình */}
              <div className="ft-progress-bar">
                <span>{timeFormat(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / song.duration) * 100}
                  onChange={handleSeek}
                />
                <span>{timeFormat(song.duration)}</span>
              </div>
            </div>

            {/* Các nút bên phải */}
            <div className="ft-right com-button-controls com-vertical-align">
              <button><BsFilePlay size={18} /></button>
              <button><TbMicrophone2 size={18} /></button>
              <button><HiOutlineQueueList size={18} /></button>
              <button><MdOutlineDevices size={18} /></button>

              {/* Điều chỉnh âm lượng */}
              <div className="ft-progress-bar ft-volume-bar com-vertical-align">
                <button><FaVolumeUp size={18} /></button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>

              <button><CgMiniPlayer size={18} /></button>
              <button><FaExpandAlt size={18} /></button>
            </div>
          </>
        ) : (
          <div className="ft-left com-button-controls com-vertical-align">
            <div className="ft-img_container">
              <img src="" alt="No Song" /> {/* Đường dẫn hình ảnh */}
            </div>
            <div className="ft-song_info com-horizontal-align">
              <h4 title="No Song">No Song</h4>
              <p title="No Artist">No Artist</p>
            </div>
            <button disabled>
              <IoMdAddCircleOutline size={20} color="gray" title={t("footer.addToLiked")} />
            </button>
          </div>
        )
      ) : (
        <div className="mcb-spotify-preview">
          <p>Xem trước Spotify</p>
          <p>Đăng ký để nghe không giới hạn các bài hát và podcast với quảng cáo không thường xuyên. Không cần thẻ tín dụng.</p>
          <button onClick={handleSignUpClick}>Đăng ký miễn phí</button>
        </div>
      )}
      <audio ref={audioRef} />
    </footer>
  );
};

export default MusicPlayerControl;
