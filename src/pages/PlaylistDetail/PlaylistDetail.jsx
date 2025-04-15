import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, ListGroup, Image } from "react-bootstrap";
import { FaPlay } from "react-icons/fa";
import SongItem from "../../components/SongItem/SongItem";
import { usePlaylist } from "../../context/PlaylistProvider";
import axiosInstance from "../../config/axiosConfig";
import "./PlaylistDetail.css";
import Loading from "../../components/Loading/Loading";
import { handleDragStart, handleDrop, handleDragOver } from '../../helpers/dragDropHelpers';
import { updatePlaylistImageInCache } from "../../helpers/cacheDataHelper"
import { handleError } from "../../helpers/toast";
import logo from "../../assets/images/logo.png";

const PlaylistDetail = () => {
    const { t } = useTranslation();
    const [playlistData, setPlaylistData] = useState([]); // Updated state to handle the entire response
    const [playlistArrangeSong, setPlaylistArrangeSong] = useState(null);
    const [isArrange, setIsArrange] = useState(false);
    const [isVisibleArrange, setIsVisibleArrange] = useState(false);
    const { addSong, clearPlaylist } = usePlaylist();
    const { idPlaylist } = useParams(); // Extract idPlaylist from the URL
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [image, setImage] = useState(null); // Lưu URL ảnh để preview
    const fileInputRef = useRef(null);

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
            }
        };

        fetchPlaylistData();
    }, [idPlaylist]);

    useEffect(() => {
        if (playlistData?.playlist?.image_path) {
            setImage(playlistData.playlist.image_path);
        } else {
            setImage(null);
        }
    }, [playlistData]);

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

    // Hàm xử lý khi chọn file
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Tạo URL để preview ảnh ngay lập tức
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);

            // Gọi hàm change ở backend
            try {
                const formData = new FormData();
                formData.append("cover", file);
                formData.append("playlistId", idPlaylist);
                await change(formData);
            } catch (error) {
                console.error("Error uploading image:", error);
                // Xử lý lỗi nếu cần (ví dụ: revert ảnh về trạng thái cũ)
                setImage(playlistData?.playlist?.image_path || null); // Revert về ảnh cũ nếu lỗi
            }
        }
    };

    // Hàm giả lập gọi API backend
    const change = async (formData) => {
        const response = await axiosInstance.patch("/premium/update/image/", formData);
        updatePlaylistImageInCache(idPlaylist, response.data.image_url);
    };

    // Khi nhấn vào khu vực ảnh, kích hoạt input file
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // if (IsCheckingRole) {
    if (isLoading) {
        return <Loading message={t("utils.loading")} height="100" />;
    }

    return (
        <Container className="playlist-container">
            <Row className="align-items-center">
                <Col md={3} className="text-center">
                    {isVisibleArrange ? (
                        <div className="playlist-detail-image-container">
                            <div
                                className="playlist-detail-image-wrapper"
                                onClick={handleImageClick}
                                style={{
                                    backgroundImage: image ? `url(${image})` : "none",
                                    backgroundColor: image ? "transparent" : "#181818",
                                }}
                            >
                                {/* Biểu tượng người dùng chỉ hiển thị khi không có ảnh */}
                                {!playlistData?.playlist?.image_path && !image && (
                                    <svg
                                        className="playlist-detail-image-default-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                        />
                                    </svg>
                                )}
                                {/* Biểu tượng bút và text luôn tồn tại, hiển thị khi hover */}
                                <div className="playlist-detail-image-placeholder">
                                    <svg
                                        className="playlist-detail-image-edit-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"
                                        />
                                    </svg>
                                    <span className="playlist-detail-image-text">Chọn ảnh</span>
                                </div>
                            </div>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="playlist-detail-image-input"
                            />
                        </div>
                    ) : (
                        <Image
                            src={playlistData?.playlist?.image_path || logo}
                            fluid
                            rounded
                        />
                    )

                    }
                </Col>
                <Col md={9}>
                    {
                        playlistData ? (<>
                            <h2 className="fw-bold playlist-name">{playlistData?.playlist?.name}</h2>
                            <p className="playlist-detail">{playlistData?.playlist?.username}</p> {/* Display username or other details */}

                            {/* phải check xem có phải phát nhạc trong playlist hay không? */}
                            <Button variant="success" className="me-2">
                                <span>
                                    <FaPlay /> Play
                                </span>
                            </Button>
                            <Button variant="outline-light">+ Add</Button>
                        </>) : (null)
                    }
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
