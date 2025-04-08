import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MusicSlider from "../../components/MusicSlider/MusicSlider";
import Loading from "../../components/Loading/Loading";
import "./Home.css";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../config/axiosConfig";
import { useUserData } from "../../context/UserDataProvider";
import Forbidden from "../../components/Error/403/403";
import { checkData } from "../../helpers/encryptionHelper";
import { useSearch } from "../../context/SearchContext";
import HomeTabs from "../HomeTabs/HomeTabs";

const Home = () => {
    const { t } = useTranslation();

    // State để lưu trữ danh sách playlists và albums từ API
    const [playlists, setPlaylists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);

    const { searchKeyword, selectedType, setSelectedType } = useSearch();


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

    // Hàm gọi API để lấy danh sách trending playlists và albums
    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                // Gọi API để lấy danh sách trending playlists
                const playlistResponse = await axiosInstance.get("/trending/playlists/");
                setPlaylists(playlistResponse.data.trending_playlists);

                const songResponse = await axiosInstance.get("/trending/songs/");
                setSongs(songResponse.data.trending_songs);

                // Gọi API để lấy danh sách trending albums
                const albumResponse = await axiosInstance.get("/trending/albums/");
                setAlbums(albumResponse.data.trending_albums);
            } catch (error) {
                console.error("Error fetching trending data:", error.response ? error.response.data : error.message);
            } finally {
                setLoading(false); // Tắt trạng thái loading sau khi gọi API xong
            }
        };

        fetchTrendingData();
    }, []); // Chỉ chạy một lần khi component mount

    // Hiển thị loading nếu dữ liệu chưa được tải
    if (loading) {
        return <Loading message={t("utils.loading")} height="60" />;

    }

    if (!validRole) {
        return <Forbidden />;
    }

    const isSearching = searchKeyword && searchKeyword.trim().length > 0;

    return (
        <div className="col home-content">
            <div className="p-3 border rounded-3 home-content">
                {
                    isSearching ? (
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <div className="d-flex justify-content-center">
                                <button
                                    className={`custom-btn mx-2 ${selectedType === "all" ? "active" : ""}`}
                                    onClick={() => setSelectedType("all")}
                                >
                                    {t("home.all")}
                                </button>
                                <button
                                    className={`custom-btn mx-2 ${selectedType === "song" ? "active" : ""}`}
                                    onClick={() => setSelectedType("song")}
                                >
                                    {t("home.music")}
                                </button>
                                <button
                                    className={`custom-btn mx-2 ${selectedType === "playlist" ? "active" : ""}`}
                                    onClick={() => setSelectedType("playlist")}
                                >
                                    {t("home.playlists")}
                                </button>
                                <button
                                    className={`custom-btn mx-2 ${selectedType === "album" ? "active" : ""}`}
                                    onClick={() => setSelectedType("album")}
                                >
                                    {t("home.albums")}
                                </button>
                                <button
                                    className={`custom-btn mx-2 ${selectedType === "user" ? "active" : ""}`}
                                    onClick={() => setSelectedType("user")}
                                >
                                    {t("home.users")}
                                </button>
                                <button
                                    className={`custom-btn mx-2 ${selectedType === "artist" ? "active" : ""}`}
                                    onClick={() => setSelectedType("artist")}
                                >
                                    {t("home.artists")}
                                </button>
                            </div>
                        </nav>
                    ) : (
                        null
                    )
                }

                <div>
                    {isSearching ? (
                        <HomeTabs />
                    ) : (
                        <>
                            {/* Nếu không search thì hiển thị nội dung gốc */}
                            <div className="card-group card-group-scroll">
                                <MusicSlider items={playlists} type="playlist" titleSlider="Danh sách phát nổi bật" />
                            </div>
                            <div className="card-group card-group-scroll">
                                <MusicSlider items={albums} type="album" titleSlider="Album hot nhất" />
                            </div>
                            <div className="card-group card-group-scroll">
                                <MusicSlider items={songs} type="song" titleSlider="Bài hát hot nhất" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;