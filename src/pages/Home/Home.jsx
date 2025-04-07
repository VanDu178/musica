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

const Home = () => {
    const { t } = useTranslation();

    // State để lưu trữ danh sách playlists và albums từ API
    const [playlists, setPlaylists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);

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
                console.log("playlist data", playlistResponse.data);
                setPlaylists(playlistResponse.data.trending_playlists);

                const songResponse = await axiosInstance.get("/trending/songs/");
                console.log("song data", songResponse.data);
                setSongs(songResponse.data.trending_songs);

                // Gọi API để lấy danh sách trending albums
                const albumResponse = await axiosInstance.get("/trending/albums/");
                setAlbums(albumResponse.data.trending_albums);
                console.log("album data", albumResponse.data);
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
    return (
        <div className="col home-content">
            <div className="p-3 border rounded-3 home-content">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="d-flex justify-content-center">
                        <button className="custom-btn active mx-2">{t("home.all")}</button>
                        <button className="custom-btn mx-2">{t("home.music")}</button>
                        <button className="custom-btn mx-2">{t("home.playlists")}</button>
                    </div>
                </nav>

                <div>
                    <div className="card-group card-group-scroll">
                        <MusicSlider items={playlists} type="playlists" title="Danh sách phát nổi bật" />
                    </div>
                    <div className="card-group card-group-scroll">
                        <MusicSlider items={albums} type="albums" title="Album hot nhất" />
                    </div>
                    <div className="card-group card-group-scroll">
                        <MusicSlider items={songs} type="songs" title="Bài hát hot nhất" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;