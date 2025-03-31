import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, ListGroup, Image } from "react-bootstrap";
import { FaMusic, FaPause, FaPlay } from "react-icons/fa";
import { useSong } from "../../context/SongProvider";
import { useIsPlaying } from "../../context/IsPlayingProvider";
import "./SongItem.css";

const SongItem = ({ songId, song }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { idSong, setIdSong } = useSong();
    const { isPlaying, setIsPlaying } = useIsPlaying();
    const handlePlay = () => {
        setIdSong(songId);
        setIsPlaying(!isPlaying);
    }
    return (
        <ListGroup.Item
            className={`song-item ${idSong === songId && isPlaying ? "active" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Row className="align-items-center">
                <Col xs={1}>
                    {idSong === songId && isPlaying ? (
                        isHovered ? (
                            <Button variant="link" className="p-0 text-white" onClick={() => setIsPlaying(false)}>
                                <FaPause />
                            </Button>
                        ) : (
                            <FaMusic className="text-white" />
                        )
                    ) : isHovered ? (
                        <Button variant="link" className="p-0 text-white" onClick={handlePlay}>
                            <FaPlay />
                        </Button>
                    ) : (
                        song.order
                    )}
                </Col>
                <Col xs={5} className="d-flex align-items-center">
                    <Image src={song.image_path} rounded fluid style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                    <div className="song-info">
                        <div className="song-title">{song.title}</div>
                        <div className="song-artist">{song.artist}</div>
                    </div>
                </Col>
                <Col xs={3}>{song.album}</Col>
                <Col xs={2}>{song.duration}</Col>
            </Row>
        </ListGroup.Item>
    );
};


export default SongItem;