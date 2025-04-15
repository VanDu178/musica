import React, { useRef, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { BiRepeat } from "react-icons/bi";
import { BsFilePlay } from "react-icons/bs";
import { CgMiniPlayer } from "react-icons/cg";
import { FaExpandAlt, FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { HiOutlineQueueList } from "react-icons/hi2";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuShuffle } from "react-icons/lu";
import { MdOutlineDevices } from "react-icons/md";
import { TbMicrophone2 } from "react-icons/tb";
import axiosInstance from "../../config/axiosConfig";
import { useUserData } from "../../context/UserDataProvider";
import { useSong } from "../../context/SongProvider";
import { useIsPlaying } from "../../context/IsPlayingProvider";
import { usePlaylist } from "../../context/PlaylistProvider";
import "./MusicPlayerControl.css";
import PlaylistModal from "../../components/Modal/PlaylistModal/PlaylistModal"
import { formatTime } from "../../helpers/timeFormatter";
import { checkData } from "../../helpers/encryptionHelper";

const MusicPlayerControl = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Sử dụng useNavigate
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(40);
  const [isMuted, setIsMuted] = useState(false);
  const [song, setSong] = useState(null);
  const { isLoggedIn } = useUserData();
  const { idSong, setIdSong } = useSong();
  const { isPlaying, setIsPlaying } = useIsPlaying();
  const { playlist, addSong, removeSong, clearPlaylist } = usePlaylist();
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const time = useRef(0);  // Biến lưu giá trị
  const hashUpdateHistory = useRef(0);  // Biến xem đã cập nhật lượt nghe chưa


  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  // Hàm fetch dữ liệu bài hát
  const fetchSongDetails = async (songId) => {
    const checkedRoleUser = await checkData(3);
    if (checkedRoleUser) {
      try {
        const response = await axiosInstance.get(`/song/${songId}/`);
        console.log(response);
        if (response.status === 200) {
          setSong(response.data);
          console.log(response.data);
          if (audioRef.current) {
            hashUpdateHistory.current = 0;//reset trạng thái update
            time.current = 0; //reset thời gian
            audioRef.current.src = response.data.mp3_path; // Đường dẫn src của file âm thanh
            await audioRef.current.play(); // Phát nhạc ngay
            setIsPlaying(true); // Cập nhật trạng thái phát nhạc
          }
        }
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    }
  };

  const handlePrev = async () => {
    const checkedRoleUser = await checkData(3);
    if (checkedRoleUser) {
      try {
        const response = await axiosInstance.get(`song/previous/${idSong}/`);
        if (response.status === 200) {
          setIdSong(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    }
  };

  const handleNext = async () => {
    if (isRepeat) {
      if (playlist.length === 1) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0; // Đặt thời gian về 0
          audioRef.current.play(); // Phát lại bài hát
          hashUpdateHistory.current = 0;//reset trạng thái update
        }
      } else {
        // Lặp lại toàn bộ playlist
        if (currentTrackIndex < playlist.length - 1) {
          setCurrentTrackIndex(prevIndex => prevIndex + 1);
          setIdSong(playlist[currentTrackIndex + 1].id);
        } else {
          setCurrentTrackIndex(0);
          setIdSong(playlist[0].id);
        }
      }
      return;
    }

    if (isShuffle) {
      if (playlist.length === 1) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0; // Đặt thời gian về 0
          audioRef.current.play(); // Phát lại bài hát
          hashUpdateHistory.current = 0;//reset trạng thái update
        }
      } else {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === currentTrackIndex); // Không trùng bài hiện tại

        setCurrentTrackIndex(randomIndex);
        setIdSong(playlist[randomIndex].id);
      }
      return;
    }

    const fetchNextSong = async () => {
      const checkedRoleUser = await checkData(3);
      if (checkedRoleUser) {
        try {
          const response = await axiosInstance.get(`/song/next/${idSong}/`);
          if (response.status === 200) {
            clearPlaylist();
            addSong({ id: response.data.id });
            setIdSong(response.data.id);
          }
        } catch (error) {
          console.error("Error fetching next song:", error);
        }
        return;
      }
    }

    // Nếu chỉ có 1 bài, gọi API lấy bài tiếp theo
    if (playlist.length === 1) {
      fetchNextSong();
      return;
    }

    // Chế độ bình thường: Chuyển sang bài tiếp theo
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prevIndex => prevIndex + 1);
      setIdSong(playlist[currentTrackIndex + 1].id);
    } else {
      // Nếu hết danh sách (không có shuffle hay repeat), gọi API lấy bài tiếp theo
      fetchNextSong();
      return;
    }
    fetchNextSong();
  };

  const updatePlayHistory = async (songId) => {
    const checkedRoleUser = await checkData(3);
    if (checkedRoleUser) {
      try {
        await axiosInstance.post(`/history/update/`, {
          song_id: songId,
        });
      } catch (error) {
        console.error("Error updating play history:", error);
      }
    }
  };

  // Gọi hàm fetch dữ liệu khi component mount
  useEffect(() => {
    if (isLoggedIn) {
      if (idSong) {
        fetchSongDetails(idSong);
      }
    }
  }, [isLoggedIn, idSong]);

  // Xử lý Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    time.current += 1;  // Tăng giá trị mỗi lần useEffect chạy
    // Hàm cập nhật thời gian hiện tại và tính tổng thời gian nghe
    const updateTime = () => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        setCurrentTime(currentTime); // Cập nhật thời gian hiện tại để hiển thị
      }
    };

    //nếu qua 80s mà tổng thời gian nghe >= 60s thì cập nhật lượt nghe và chuyển trạng thái đã cập nhật
    if (currentTime >= 80) {
      if (time.current > 250) {
        if (hashUpdateHistory.current === 0) {
          updatePlayHistory(idSong);
          hashUpdateHistory.current = 1;
        }
      }
    }

    const handleSongEnd = () => {
      //nếu bài hát kết thúc mà tổng thời gian nghe >= 60s và trạng thái chưa cập nhật thì cập nhật lượt nghe và chuyển trạng thái đã cập nhật
      if (time.current > 250) {
        if (hashUpdateHistory.current === 0) {
          updatePlayHistory(idSong);
          hashUpdateHistory.current = 1;
        }
      }
      handleNext(); // Chuyển sang bài tiếp theo
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("ended", handleSongEnd);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [audioRef, handleNext]); // Thêm handleNext vào dependencies

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

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Hàm điều hướng đến trang đăng nhập
  const handleSignUpClick = () => {
    navigate("/login");
  };

  // Hàm xử lý toggle repeat
  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    // Thêm logic xử lý repeat tại đây (nếu cần)
  };

  // Hàm xử lý toggle shuffle
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    // Thêm logic xử lý shuffle tại đây (nếu cần)
  };

  return (
    <>
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
                  <p title={`${song.artist}, ${song.collab_artists.join(', ')}`}>
                    {song.artist}, {song.collab_artists.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                >
                  <IoMdAddCircleOutline size={20} color="white" title={t("footer.addToLiked")} />
                </button>
              </div>

              {/* Phần điều khiển nhạc */}
              <div className="ft-center com-horizontal-align">
                <div className="com-button-controls ft-vertical-align">
                  <button
                    className=""
                    title={t("footer.shuffle")}
                    style={{ color: isShuffle ? 'green' : 'inherit' }}
                    onClick={toggleShuffle}
                  >
                    <LuShuffle
                      color={isShuffle ? 'green' : 'currentColor'}
                      size={20}
                    />
                  </button>
                  <button className="" title={t("footer.prev")} onClick={handlePrev}>
                    <FaStepBackward size={20} />
                  </button>
                  <button onClick={togglePlay} title={t("footer.play")}>
                    {isPlaying ? <FaPauseCircle size={32} /> : <FaPlayCircle size={32} />}
                  </button>
                  <button
                    title={t("footer.next")}
                    onClick={handleNext}
                  >
                    <FaStepForward size={20} />
                  </button>
                  <button
                    title={t("footer.repeat")}
                    onClick={toggleRepeat}
                    style={{ color: isRepeat ? 'green' : 'inherit' }}
                  >
                    <BiRepeat color={isRepeat ? 'green' : 'currentColor'} size={20} />
                  </button>
                </div>

                {/* Thanh tiến trình */}
                <div className="ft-progress-bar">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / (song.duration - 1)) * 100}
                    onChange={handleSeek}
                  />
                  <span>{formatTime(song.duration)}</span>
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
                  <button onClick={toggleMute}>
                    {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume} // Nếu tắt tiếng thì thanh trượt về 0
                    onChange={handleVolumeChange}
                    disabled={isMuted} // Khi tắt tiếng, không cho thay đổi volume
                  />
                </div>


                <button><CgMiniPlayer size={18} /></button>
                <button><FaExpandAlt size={18} /></button>
              </div>
            </>
          ) : (
            <>
              {/* Phần hiển thị bài hát */}
              <div className="ft-left com-button-controls com-vertical-align">
                <div className="ft-img_container">
                  <img
                    src='data:image/png;base64,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'
                    alt="Song"
                  /> {/* Đường dẫn hình ảnh */}
                </div>
                <div className="ft-song_info com-horizontal-align">
                  <h4>Zmusic</h4>
                  <p>Zmusic</p>
                </div>
              </div>

              {/* Phần điều khiển nhạc */}
              <div className="ft-center com-horizontal-align">
                <div className="com-button-controls ft-vertical-align">
                  <button
                    className="mcb-disabled-button"
                    title={t("footer.shuffle")}
                    disabled
                  >
                    <LuShuffle color="green" size={20} />
                  </button>
                  <button
                    className="mcb-disabled-button"
                    title={t("footer.prev")}
                    disabled
                  >
                    <FaStepBackward size={20} />
                  </button>
                  <button
                    className="mcb-disabled-button"
                    disabled
                    title={t("footer.play")}
                  >
                    {
                      isPlaying ?
                        <FaPauseCircle
                          className="mcb-disabled-button"
                          size={32}
                          disabled
                        />
                        : <FaPlayCircle
                          className="mcb-disabled-button"
                          size={32}
                          disabled
                        />
                    }
                  </button>
                  <button
                    className="mcb-disabled-button"
                    title={t("footer.next")}
                    disabled
                  >
                    <FaStepForward
                      className="mcb-disabled-button"
                      size={20}
                      disabled
                    />
                  </button>
                  <button
                    className="mcb-disabled-button"
                    title={t("footer.repeat")}
                    disabled
                  >
                    <BiRepeat
                      className="mcb-disabled-button"
                      size={20}
                    />
                  </button>
                </div>

                {/* Thanh tiến trình */}
                <div className="ft-progress-bar">
                  <span>{formatTime(0)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={0}
                  />
                  <span>{formatTime(0)}</span>
                </div>
              </div>

              {/* Các nút bên phải */}
              <div className="ft-right com-button-controls com-vertical-align">
                <button
                  className="mcb-disabled-button"
                  disabled
                >
                  <BsFilePlay
                    className="mcb-disabled-button"
                    size={18}
                    disabled
                  />
                </button>
                <button
                  className="mcb-disabled-button"
                  disabled
                >
                  <TbMicrophone2
                    className="mcb-disabled-button"
                    size={18}
                    disabled
                  />
                </button>
                <button
                  className="mcb-disabled-button"
                  disabled
                >
                  <HiOutlineQueueList
                    className="mcb-disabled-button"
                    size={18}
                    disabled
                  />
                </button>
                <button
                  className="mcb-disabled-button"
                  disabled
                >
                  <MdOutlineDevices
                    className="mcb-disabled-button"
                    size={18}
                    disabled
                  />
                </button>

                {/* Điều chỉnh âm lượng */}
                <div className="ft-progress-bar ft-volume-bar com-vertical-align">
                  <button
                    className="mcb-disabled-button"
                    disabled
                  >
                    <FaVolumeUp size={18} />
                  </button>
                  <input
                    className="mcb-disabled-button"
                    type="range"
                    min="0"
                    max="100"
                    value={0}
                  />
                </div>

                <button
                  className="mcb-disabled-button"
                  disabled
                >
                  <CgMiniPlayer
                    className="mcb-disabled-button"
                    size={18}
                    disabled
                  />
                </button>
                <button
                  className="mcb-disabled-button"
                  disabled
                >
                  <FaExpandAlt
                    className="mcb-disabled-button"
                    size={18}
                    disabled
                  />
                </button>
              </div>
            </>
          )
        ) : (
          <div className="mcb-spotify-preview">
            <p>Xem trước Spotify</p>
            <p>Đăng ký để nghe không giới hạn các bài hát và podcast với quảng cáo không thường xuyên. Không cần thẻ tín dụng.</p>
            <button onClick={handleSignUpClick}>Đăng ký miễn phí</button>
          </div>
        )}
        <audio
          ref={audioRef}
        />
      </footer>
      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default MusicPlayerControl;
