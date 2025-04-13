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
import { handleDragStart, handleDrop, handleDragOver } from '../../helpers/dragDropHelpers';
import { handleError } from "../../helpers/toast";

const PlaylistDetail = () => {
    const { t } = useTranslation();
    const [playlistData, setPlaylistData] = useState(null); // Updated state to handle the entire response
    const [playlistArrangeSong, setPlaylistArrangeSong] = useState(null);
    const [isArrange, setIsArrange] = useState(false);
    const [isVisibleArrange, setIsVisibleArrange] = useState(false);
    const { addSong, clearPlaylist } = usePlaylist();
    const { idPlaylist } = useParams(); // Extract idPlaylist from the URL
    const { isPlaying, setIsPlaying } = useIsPlaying();
    const { isLoggedIn } = useUserData();
    const navigate = useNavigate();
    const [validRole, setValidRole] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            setIsLoading(true);
            if (isLoggedIn) {
                //nếu đang login thì check role phải user hoặc artist không
                const checkedRoleArtist = await checkData(2);
                const checkedRoleUser = await checkData(3);

                if (checkedRoleArtist || checkedRoleUser) {
                    setValidRole(true);
                    setIsLoading(false)
                }
            }
            else {
                //nếu không login vẫn cho phép xem
                setValidRole(false);
                setIsLoading(false);
            }
        };

        fetchRole();
    }, [isLoggedIn, idPlaylist]);




    // Hàm gọi xuống backend để lấy danh sách bài hát theo playlistId
    const fetchSongsByPlaylistId = async (playlistId) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(
                `/playlists/songs/${playlistId}/`
            );
            if (response?.data) {
                setIsVisibleArrange(response?.data?.isOwner);
                return response.data; // Trả về dữ liệu bài hát nếu có
            } else {
                console.log("No songs found for this playlist.");
                return []; // Trả về mảng rỗng nếu không có bài hát
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
        finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        // Fetch playlist and songs from the backend
        const fetchPlaylistData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchSongsByPlaylistId(idPlaylist); // Fetch data
                setPlaylistData(data); // Set the fetched data
                setPlaylistArrangeSong(data?.songs)
                clearPlaylist();
                data.songs.forEach((song) => {
                    addSong({ id: song.id });
                });
            } catch (error) {
                console.log(error);
            }
            finally {
                setIsLoading(false)
                setValidRole(false);
            }
        };

        fetchPlaylistData();
    }, [idPlaylist]);

    const HandleOpenArrange = () => {
        setIsArrange(true);
    };

    // Hàm so sánh hai object bài hát
    const areSongsEqual = (song1, song2) => {
        // So sánh các thuộc tính quan trọng của bài hát
        // Thay đổi các thuộc tính này tùy theo cấu trúc dữ liệu của bạn
        return (
            song1.id === song2.id &&
            song1.title === song2.title &&
            song1.artist === song2.artist
            // Thêm các thuộc tính khác nếu cần: song1.album === song2.album, v.v.
        );
    };

    const HandleArrange = async () => {
        setIsLoadingUpdate(true);
        // Kiểm tra xem hai mảng có giống nhau không
        const isSameOrder =
            playlistArrangeSong.length === playlistData.songs.length &&
            playlistArrangeSong.every((song, index) =>
                areSongsEqual(song, playlistData.songs[index])
            );
        if (isSameOrder) {
            // Danh sách bài hát không thay đổi, không gọi API.
            setIsLoadingUpdate(false);
            setIsArrange(false);
            return; // Thoát hàm nếu danh sách giống nhau
        }
        const songIds = playlistArrangeSong.map(song => song.id);
        console.log(songIds);
        try {
            const response = await axiosInstance.patch(
                `/premium/update/order-playlist/`,
                {
                    listSong: songIds,
                    playlistId: playlistData.playlist.id
                }
            );
            if (response.status === 200 || response.status === 204) {
                setIsLoadingUpdate(false);
                setIsArrange(false);
            }
        } catch (error) {
            if (error?.status == 403) {
                handleError(t("utils.403"));
                setIsLoadingUpdate(false);
                setIsVisibleArrange(false);
                setPlaylistArrangeSong(playlistData.songs)
            }
            console.error("Error fetching songs:", error);
        }
        setIsLoadingUpdate(false);
        setIsArrange(false);
    };

    // if (IsCheckingRole) {
    if (isLoading) {
        return <Loading message={t("utils.loading")} height="100" />;
    }

    if (validRole == false) {
        return <Forbidden />;
    }

    return (
        <Container className="playlist-container">
            <Row className="align-items-center">
                <Col md={3}>
                    <Image
                        src={playlistData?.playlist?.image_path || "https://via.placeholder.com/300"} // Use placeholder if image_path is null
                        fluid
                        rounded
                    />
                </Col>
                <Col md={9}>
                    <h2 className="fw-bold playlist-name">{playlistData.playlist.name}</h2>
                    <p className="playlist-detail">{playlistData.playlist.username}</p> {/* Display username or other details */}

                    {/* phải check xem có phải phát nhạc trong playlist hay không? */}
                    <Button variant="success" className="me-2">
                        <span>
                            <FaPlay /> Play
                        </span>
                    </Button>
                    <Button variant="outline-light">+ Add</Button>
                </Col>
            </Row>
            <hr />
            <ListGroup variant="flush">
                {isLoadingUpdate ? (
                    <div className="playlist-detail-update-container" >
                        <button
                            className="playlist-detail-update-btn"
                        >
                            {t("utils.handleUpdate")}
                        </button>
                    </div>
                ) : (
                    isVisibleArrange && (
                        isArrange ? (
                            <div className="playlist-detail-update-container" >
                                <button
                                    className="playlist-detail-update-btn"
                                    onClick={HandleArrange}
                                >
                                    {t("utils.Update")}
                                </button>
                            </div>

                        ) : (
                            <div className="playlist-detail-update-container">
                                <button
                                    className="playlist-detail-update-btn"
                                    onClick={HandleOpenArrange}
                                >
                                    {t("utils.Arrange")}
                                </button>
                            </div>
                        )
                    )
                )
                }

                <ListGroup.Item className="song-header">
                    <Row>
                        <Col xs={1}>#</Col>
                        <Col xs={5}>{t("playlist.title")}</Col>
                        <Col xs={3}>Album</Col>
                        <Col xs={2}>{t("playlist.time")}</Col>
                    </Row>
                </ListGroup.Item>
                {isArrange ? (
                    playlistArrangeSong?.map((song, index) => (
                        <div
                            key={song.id} // nên có để React xử lý đúng
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index, playlistArrangeSong, setPlaylistArrangeSong)}
                        >
                            <SongItem
                                // key={song.id}
                                songId={song.id}
                                song={song}
                                isArrange={true}
                            />
                        </div>
                    ))
                ) : (
                    playlistArrangeSong?.map((song, index) => (
                        <SongItem
                            // key={song.id}
                            songId={song.id}
                            song={song}
                            songOder={index}
                        />
                    ))
                )

                }
            </ListGroup >
        </Container >
    );
};

export default PlaylistDetail;
