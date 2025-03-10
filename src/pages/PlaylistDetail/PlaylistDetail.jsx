import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, ListGroup, Image } from "react-bootstrap";
import { FaPlay, FaPause } from "react-icons/fa";
import SongItem from "../../components/SongItem/SongItem";
import "./PlaylistDetail.css";

const playlist = {
    title: "Tuyển tập nhạc thập niên 2000",
    description: "Arctic Monkeys, Coldplay, Linkin Park và nhiều hơn nữa",
    cover: "https://via.placeholder.com/300",
    songs: [
        { id: 1, title: "I Wanna Be Yours", artist: "Arctic Monkeys", album: "AM", duration: "3:03", cover: "https://images.unsplash.com/photo-1560674457-12073ed6fae6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D" },
        { id: 2, title: "Chúng Ta Không Thuộc Về Nhau", artist: "Sơn Tùng M-TP", album: "m-tp M-TP", duration: "3:53", cover: "https://images.unsplash.com/photo-1560674457-12073ed6fae6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D" },
    ],
};

const PlaylistDetail = () => {
    const { t } = useTranslation();
    const [activeSong, setActiveSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <Container className="playlist-container">
            <Row className="align-items-center">
                <Col md={3}>
                    <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj8sKRgBGHeqyyzcVzby3YrHH_s0KVk-PozzvgrCdsueqkbhorjmZ0cByvks-Oy9tK38M&usqp=CAU" fluid rounded />
                </Col>
                <Col md={9}>
                    <h2 className="fw-bold">{playlist.title}</h2>
                    <p>{playlist.description}</p>
                    <Button variant="success" className="me-2" onClick={togglePlay}>
                        {isPlaying ? <span><FaPause /> Pause</span> : <span><FaPlay /> Play</span>}
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
                {playlist.songs.map((song) => (
                    <SongItem key={song.id} song={song} isActive={song.id === activeSong} onClick={setActiveSong} />
                ))}
            </ListGroup>
        </Container>
    );
};

export default PlaylistDetail;
