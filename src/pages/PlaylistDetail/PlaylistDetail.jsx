import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, ListGroup, Image } from "react-bootstrap";
import { FaPlay, FaPause } from "react-icons/fa";
import SongItem from "../../components/SongItem/SongItem";
import { usePlaylist } from "../../context/PlaylistProvider";
import axiosInstance from "../../config/axiosConfig";
import { useSong } from "../../context/SongProvider";
import { useIsPlaying } from "../../context/IsPlayingProvider";
import { useUserData } from "../../context/UserDataProvider";
import { useIsVisiableRootModal } from "../../context/IsVisiableRootModal";
import "./PlaylistDetail.css";
import Forbidden from "../../components/Error/403/403";
import { checkData } from "../../helpers/encryptionHelper";
import Loading from "../../components/Loading/Loading";


const PlaylistDetail = () => {
    const { t } = useTranslation();
    const [playlistData, setPlaylistData] = useState(null); // Updated state to handle the entire response
    const { playlist, addSong, removeSong, clearPlaylist } = usePlaylist();
    const { idPlaylist } = useParams(); // Extract idPlaylist from the URL
    const { idSong, setIdSong } = useSong();
    const { isPlaying, setIsPlaying } = useIsPlaying();
    const { isLoggedIn, setIsLoggedIn, userData, setUserData } = useUserData();
    const { setIsVisiableRootModal } = useIsVisiableRootModal();
    const navigate = useNavigate();
    const [validRole, setValidRole] = useState(false);
    const [IsCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            setIsCheckingRole(true);
            if (isLoggedIn) {
                //nếu đang login thì check role phải user hoặc artist không
                const checkedRoleArtist = await checkData(2);
                const checkedRoleUser = await checkData(3);

                if (checkedRoleArtist || checkedRoleUser) {
                    setValidRole(true);
                    setIsCheckingRole(false);
                }
            }
            //nếu không login vẫn cho phép xem
            setValidRole(true);
            setIsCheckingRole(false);
        };

        fetchRole();
    }, [isLoggedIn]);

    const togglePlay = () => {
        if (isLoggedIn) {
            if (playlistData && playlistData.songs.length > 0 && idSong) {
                setIsPlaying(!isPlaying);
            }
            else {
                setIdSong(playlistData.songs[0].id); // Phát bài hát đầu tiên nếu chưa phát bài nào
                setIsPlaying(!isPlaying);
            }
        }
        else {
            setIsVisiableRootModal(true);
        }
    };


    // Hàm gọi xuống backend để lấy danh sách bài hát theo playlistId
    const fetchSongsByPlaylistId = async (playlistId) => {
        try {
            const response = await axiosInstance.get(
                `/playlists/songs/${playlistId}/`
            );
            if (response?.data) {
                return response.data; // Trả về dữ liệu bài hát nếu có
            } else {
                console.log("No songs found for this playlist.");
                return []; // Trả về mảng rỗng nếu không có bài hát
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };


    useEffect(() => {
        // Fetch playlist and songs from the backend
        const fetchPlaylistData = async () => {
            try {
                const data = await fetchSongsByPlaylistId(idPlaylist); // Fetch data
                setPlaylistData(data); // Set the fetched data
                clearPlaylist();
                // if (data.status == 403) {
                //     setValidRole(false);
                // }
                console.log("thongtin", data);
                data.songs.forEach((song) => {
                    console.log("Adding song to playlist:", song.id);
                    addSong({ id: song.id });
                });
            } catch (error) {

                setValidRole(false);

            }
        };

        fetchPlaylistData();
    }, []);

    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="100" />;
    }

    if (!playlistData) {
        return <p>Loading...</p>; // Show loading state while data is being fetched
    }
    if (!validRole) {
        return <Forbidden />;
    }

    return (
        <Container className="playlist-container">
            <Row className="align-items-center">
                <Col md={3}>
                    <Image
                        src={playlistData.playlist.image_path || "https://via.placeholder.com/300"} // Use placeholder if image_path is null
                        fluid
                        rounded
                    />
                </Col>
                <Col md={9}>
                    <h2 className="fw-bold playlist-name">{playlistData.playlist.name}</h2>
                    <p className="playlist-detail">{playlistData.playlist.username}</p> {/* Display username or other details */}

                    {/* phải check xem có phải phát nhạc trong playlist hay không? */}
                    <Button variant="success" className="me-2" onClick={togglePlay}>
                        {isPlaying ? (
                            <span>
                                <FaPause /> Pause
                            </span>
                        ) : (
                            <span>
                                <FaPlay /> Play
                            </span>
                        )}
                    </Button>
                    <Button variant="outline-light">+ Add</Button>
                </Col>
            </Row>
            <hr />
            <ListGroup variant="flush">
                <ListGroup.Item className="song-header">
                    <Row>
                        <Col xs={1}>#</Col>
                        <Col xs={5}>{t("playlist.title")}</Col>
                        <Col xs={3}>Album</Col>
                        <Col xs={2}>{t("playlist.time")}</Col>
                    </Row>
                </ListGroup.Item>
                {playlistData?.songs?.map((song, index) => (
                    <SongItem
                        // key={song.id}
                        songId={song.id}
                        song={song}
                    />
                ))}
            </ListGroup>
        </Container>
    );
};

export default PlaylistDetail;
