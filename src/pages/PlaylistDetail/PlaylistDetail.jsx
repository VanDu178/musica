import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, ListGroup, Image } from "react-bootstrap";
import { FaPlay, FaPause } from "react-icons/fa";
import SongItem from "../../components/SongItem/SongItem";
import { usePlaylist } from "../../context/PlaylistProvider";
import axiosInstance from "../../config/axiosConfig";
// import { useSong } from "../../context/SongProvider";
import "./PlaylistDetail.css";


// const playlist = {
//     title: "Tuyển tập nhạc thập niên 2000",
//     description: "Arctic Monkeys, Coldplay, Linkin Park và nhiều hơn nữa",
//     cover: "https://via.placeholder.com/300",
//     songs: [
//         { id: 1, title: "I Wanna Be Yours", artist: "Arctic Monkeys", album: "AM", duration: "3:03", cover: "https://images.unsplash.com/photo-1560674457-12073ed6fae6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D" },
//         { id: 2, title: "Chúng Ta Không Thuộc Về Nhau", artist: "Sơn Tùng M-TP", album: "m-tp M-TP", duration: "3:53", cover: "https://images.unsplash.com/photo-1560674457-12073ed6fae6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D" },
//     ],
// };

const PlaylistDetail = () => {
    const { t } = useTranslation();
    const [playlistData, setPlaylistData] = useState(null); // Updated state to handle the entire response
    const { playlist, addSong, removeSong, clearPlaylist } = usePlaylist();
    const { idPlaylist } = useParams(); // Extract idPlaylist from the URL
    const [activeSong, setActiveSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };


    // Hàm gọi xuống backend để lấy danh sách bài hát theo playlistId
    const fetchSongsByPlaylistId = async (playlistId) => {
        try {
            const response = await axiosInstance.get(
                `/playlists/${playlistId}/songs`
            );
            const songs = response.data; // Lấy dữ liệu từ response
            //   setPlaylist(songs); // Cập nhật danh sách bài hát vào state
            //   console.log("Songs fetched:", songs);
            return songs;
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
                data.songs.id.map((id) => {
                    addSong({ id: id });
                });
            } catch (error) {
                console.error("Error fetching playlist data:", error);
            }
        };

        fetchPlaylistData();

    }, []);


    if (!playlistData) {
        return <p>Loading...</p>; // Show loading state while data is being fetched
    }



    // const { playlistInfo, songs } = playlistData; // Destructure playlist and songs from the fetched data

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
                    <h2 className="fw-bold">{playlistData.playlist.name}</h2>
                    <p>{playlistData.playlist.username}</p> {/* Display username or other details */}
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
                {playlistData.songs.map((song, index) => (
                    <SongItem
                        // key={song.id}
                        songId={song.id}
                        song={song}
                        isActive={song.id === activeSong}
                        onClick={() => setActiveSong(song.id)}
                    />
                ))}
            </ListGroup>
        </Container>
    );
};

export default PlaylistDetail;
