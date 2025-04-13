import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../config/axiosConfig";
import MusicSlider from "../../components/MusicSlider/MusicSlider";
import { Row, Col, ListGroup } from "react-bootstrap";
import { useSong } from "../../context/SongProvider";
import { useIsPlaying } from "../../context/IsPlayingProvider";
import { usePlaylist } from "../../context/PlaylistProvider";
import SongItem from "../../components/SongItem/SongItem";
import { useUserData } from "../../context/UserDataProvider";
import { hash, checkData } from "../../helpers/encryptionHelper";
import Forbidden from "../../components/Error/403/403";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { useIsVisiableRootModal } from "../../context/IsVisiableRootModal";
import "./PublicProfile.css";
import { Flashlight } from "lucide-react";

const PublicProfile = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    inFor: {},
    playlists: [],
    albums: [],
    popularSongs: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isArtist, setIsArtist] = useState(false);
  const { addSong, clearPlaylist } = usePlaylist();
  const { isPlaying, setIsPlaying } = useIsPlaying();
  const { isLoggedIn, userData } = useUserData();
  const [validRole, setValidRole] = useState(false);
  const popularRef = useRef(null);
  const albumsRef = useRef(null);
  const aboutRef = useRef(null);
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(4); // mỗi lần load 4 playlist
  const [popularSongs, setPopularSongs] = useState([]);
  const [nextPopularSongsUrl, setNextPopularSongsUrl] = useState(null);
  const [hasMorePopularSongs, setHasMorePopularSongs] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      if (isLoggedIn) {
        //nếu đang login thì check role phải user không
        const checkedRoleUser = await checkData(3);
        if (checkedRoleUser) {
          setValidRole(true);
          setIsLoading(false);
        }
      } else {
        //nếu không login thì hiển thị
        setValidRole(false);
        setIsLoading(false);
      }
      setIsLoading(false);
    };

    fetchRole();
  }, [isLoggedIn]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null); // Clear previous error
      try {
        await fetchProfile();
        if (isArtist) {
          await Promise.all([fetchAlbums(), fetchPopularSongs()]);
        } else {
          await fetchPlaylists();
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu hồ sơ.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [profileId, isArtist]);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(`/public-profile/${profileId}/`);
      if (response?.status === 200) {
        setIsArtist(response?.data?.role?.name === "artist");
        setProfile((prevState) => ({
          ...prevState,
          inFor: response?.data,
        }));
      }
    } catch (error) {
      throw new Error("Không thể tải thông tin hồ sơ.");
    }
  };

  const fetchPopularSongs = async (
    url = `/public-profile/popular-songs/${profileId}/?page=1&page_size=4`
  ) => {
    try {
      const response = await axiosInstance.get(url);
      const { results, next } = response.data;

      console.log("popularSongs", response.data);

      // Cập nhật state với dữ liệu mới
      setProfile((prevState) => ({
        ...prevState,
        popularSongs: url.includes("page=1")
          ? results // Reset nếu là trang đầu tiên
          : [...prevState.popularSongs, ...results], // Append nếu là các trang tiếp theo
      }));

      // Xử lý playlist
      clearPlaylist();
      results.forEach((song) => {
        addSong({ id: song.id });
      });

      // Cập nhật state cho phân trang
      setNextPopularSongsUrl(next); // Lưu URL của trang tiếp theo
      setHasMorePopularSongs(!!next); // Kiểm tra xem còn dữ liệu để load không
    } catch (err) {
      console.error("Error fetching popular songs:", err);
      setError(
        err.response?.data?.error || "Không thể tải danh sách bài hát phổ biến."
      );
    }
  };
  const fetchAlbums = async () => {
    try {
      const response = await axiosInstance.get(
        `/public-profile/albums/${profileId}/`
      );
      if (response?.status === 200) {
        setProfile((prevState) => ({
          ...prevState,
          albums: response?.data,
        }));
      }
    } catch (err) {
      throw new Error("Không thể tải album.");
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axiosInstance.get(
        `/public-profile/playlists/${profileId}/`
      );
      if (response?.status === 200) {
        setProfile((prevState) => ({
          ...prevState,
          playlists: response?.data,
        }));
      }
    } catch (err) {
      throw new Error("Không thể tải playlist.");
    }
  };

  const HandleMessage = () => {
    if (isArtist || userData.id === profileId) {
      return; // không làm gì khi là artist hoặc đang xem chính mình
    }
    navigate("/user/chat", {
      state: {
        otherUserId: profileId,
        otherUserName: profile?.inFor?.name || null,
        otherUserAVT: profile?.inFor?.image_path || null,
      },
    });
  };

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!validRole) {
    return <Forbidden />;
  }

  if (isLoading) {
    return <Loading message={t("utils.loading")} height="80" />;
  }

  return (
    <div className="public-profile-container">
      <div className="public-profile-header">
        <div className="public-profile-header-content">
          <img
            src={
              profile?.inFor?.image_path || "../../images/default-avt-img.jpeg"
            }
            alt={profile?.inFor?.name}
            className="public-profile-avatar"
            onError={(e) => {
              e.target.onerror = null; // tránh vòng lặp nếu fallback cũng lỗi
              e.target.src = "../../images/default-avt-img.jpeg";
            }}
          />
          <div className="public-profile-info">
            <span className="public-profile-type">
              {userData.id + "" === profileId
                ? t("publicProfile.mine")
                : isArtist
                ? t("publicProfile.artist")
                : t("publicProfile.user")}
            </span>
            <div className="public-profile-name-container">
              <h2 className="public-profile-name">{profile?.inFor?.name}</h2>
              {isArtist && (
                <div className="public-profile-verified-artist">
                  <span className="public-profile-verified-check">✔</span>
                  <span className="public-profile-verified-text">
                    {t("publicProfile.verified_artist")}
                  </span>
                </div>
              )}

              {/* Nút nhắn tin */}
              {!isArtist && userData.id + "" !== profileId && (
                <button
                  className="public-profile-message-btn"
                  onClick={HandleMessage}
                  title={t("publicProfile.message")}
                >
                  <svg
                    className="message-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="message-text">
                    {t("publicProfile.message")}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="public-profile-content">
        {isArtist && (
          <div className="public-profile-play-controls">
            <button className="public-profile-play-pause-btn">▶</button>
          </div>
        )}

        <div className="public-profile-tabs">
          <div className="public-profile-tab-list">
            {isArtist ? (
              <>
                <button
                  className="public-profile-tab"
                  onClick={() => scrollToSection(popularRef)}
                >
                  {t("publicProfile.popular")}
                </button>
                <button
                  className="public-profile-tab"
                  onClick={() => scrollToSection(albumsRef)}
                >
                  {t("publicProfile.albums")}
                </button>
                <button
                  className="public-profile-tab"
                  onClick={() => scrollToSection(aboutRef)}
                >
                  {t("publicProfile.about")}
                </button>
              </>
            ) : (
              <button className="public-profile-tab active">
                {t("publicProfile.playlists")}
              </button>
            )}
          </div>

          {isArtist ? (
            <div className="public-profile-tab-content" ref={popularRef}>
              <section className="public-profile-section">
                <h2 className="public-profile-section-title">
                  {t("publicProfile.popular")}
                </h2>
                <ListGroup variant="flush">
                  <ListGroup.Item className="public-profile-song-header">
                    <Row>
                      <Col xs={1}>#</Col>
                      <Col xs={5}>{t("playlist.title")}</Col>
                      <Col xs={2}>{t("playlist.time")}</Col>
                    </Row>
                  </ListGroup.Item>
                  {profile?.popularSongs?.map((song, index) => {
                    song.order = ++index;
                    return (
                      <SongItem key={song.id} songId={song.id} song={song} />
                    );
                  })}
                  {hasMorePopularSongs && (
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      <button
                        className="com-glow-only"
                        onClick={() => fetchPopularSongs(nextPopularSongsUrl)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          background: "#222",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {t("leftSidebar.showMore")}
                      </button>
                    </div>
                  )}
                </ListGroup>
              </section>

              <section className="public-profile-section" ref={albumsRef}>
                <h2 className="public-profile-section-title">
                  {t("publicProfile.albums")}
                </h2>
                {profile?.albums && profile.albums.length > 0 ? (
                  <div className="public-profile-card-group public-profile-card-group-scroll">
                    <MusicSlider items={profile.albums} type="albums" />
                  </div>
                ) : (
                  <p>{t("publicProfile.no_albums")}</p>
                )}
              </section>

              <section className="public-profile-section" ref={aboutRef}>
                <h2 className="public-profile-section-title">
                  {t("publicProfile.about")}
                </h2>
                <p className="public-profile-bio">
                  {profile?.inFor?.bio || t("publicProfile.no_bio")}
                </p>
              </section>
            </div>
          ) : (
            <div className="public-profile-tab-content">
              <section className="public-profile-section">
                <h2 className="public-profile-section-title">
                  {t("publicProfile.playlists")}
                </h2>
                <div className="public-profile-card-group public-profile-card-group-scroll">
                  <MusicSlider items={profile?.playlists} type="playlists" />
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
