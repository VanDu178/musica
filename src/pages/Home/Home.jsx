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
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
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
            const CACHE_KEY = "trendingData"; // Key để lưu trong localStorage
            const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 tiếng tính bằng milliseconds

            // Hàm kiểm tra và lấy dữ liệu từ localStorage
            const getCachedData = () => {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);
                    const now = Date.now();
                    if (now - timestamp < CACHE_DURATION) {
                        return data; // Trả về dữ liệu nếu chưa quá 2 tiếng
                    }
                }
                return null; // Không có dữ liệu hoặc đã hết hạn
            };

            // Lấy dữ liệu từ localStorage
            const cachedData = getCachedData();

            if (cachedData) {
                // Nếu có dữ liệu hợp lệ trong cache, sử dụng nó
                setPlaylists(cachedData.playlists);
                setSongs(cachedData.songs);
                setAlbums(cachedData.albums);
                setArtists(cachedData.artists);
                setLoading(false);
                return; // Kết thúc hàm, không gọi API
            }

            // Nếu không có dữ liệu hoặc dữ liệu hết hạn, gọi API
            try {
                const playlistResponse = await axiosInstance.get("/trending/playlists/");
                const songResponse = await axiosInstance.get("/trending/songs/");
                const albumResponse = await axiosInstance.get("/trending/albums/");
                const artistResponse = await axiosInstance.get("/trending/artists/");


                // Cập nhật state với dữ liệu mới
                setPlaylists(playlistResponse.data.trending_playlists);
                setSongs(songResponse.data.trending_songs);
                setAlbums(albumResponse.data.trending_albums);
                setArtists(artistResponse.data.trending_artists);

                // Dữ liệu mới để lưu vào localStorage
                const newData = {
                    playlists: playlistResponse.data.trending_playlists,
                    songs: songResponse.data.trending_songs,
                    albums: albumResponse.data.trending_albums,
                    artists: artistResponse.data.trending_artists,
                };

                // Lưu vào localStorage kèm thời gian cập nhật
                const dataToCache = {
                    data: newData,
                    timestamp: Date.now(), // Thời gian hiện tại
                };

                // Kiểm tra xem có dữ liệu cũ trong localStorage không
                if (localStorage.getItem(CACHE_KEY)) {
                    localStorage.removeItem(CACHE_KEY); // Xóa dữ liệu cũ
                }
                localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache)); // Lưu dữ liệu mới
            } catch (error) {
                console.error(
                    "Error fetching trending data:",
                    error.response ? error.response.data : error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingData();
    }, []); // Chỉ chạy một lần khi component mount

    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="80" />;
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
                        <MusicSlider items={artists} type="artist" titleSlider={t("search.artist")} />
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