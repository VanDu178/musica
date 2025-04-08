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
    const [IsCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            setIsCheckingRole(true);
            if (isLoggedIn) {
                //nếu đang login thì check role phải user không
                const checkedRoleUser = await checkData(3);
                if (checkedRoleUser) {
                    setValidRole(true);
                    setIsCheckingRole(false);
                }
            } else {
                //nếu không login thì hiển thị
                setValidRole(true);
                setIsCheckingRole(false);
            }
            setIsCheckingRole(false);
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

    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="100" />;
    }

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
                <div>
                    <div className="card-group card-group-scroll">
                        <MusicSlider items={songs} type="song" titleSlider={t("utils.songTrending")} />
                    </div>
                    <div className="card-group card-group-scroll">
                        <MusicSlider items={albums} type="album" titleSlider={t("utils.albumTrending")} />
                    </div>
                    <div className="card-group card-group-scroll">
                        <MusicSlider items={playlists} type="playlists" titleSlider={t("utils.playlistTrending")} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;