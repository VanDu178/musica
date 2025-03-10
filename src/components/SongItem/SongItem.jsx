import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, ListGroup, Image } from "react-bootstrap";
import { FaMusic, FaPause, FaPlay } from "react-icons/fa";
import "./SongItem.css";

const SongItem = ({ song, isActive, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <ListGroup.Item
            className={`song-item ${isActive ? "active" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Row className="align-items-center">
                <Col xs={1}>
                    {isActive ? (
                        isHovered ? (
                            <Button variant="link" className="p-0 text-white" onClick={() => onClick(null)}>
                                <FaPause />
                            </Button>
                        ) : (
                            <FaMusic className="text-white" />
                        )
                    ) : isHovered ? (
                        <Button variant="link" className="p-0 text-white" onClick={() => onClick(song.id)}>
                            <FaPlay />
                        </Button>
                    ) : (
                        song.id
                    )}
                </Col>
                <Col xs={5} className="d-flex align-items-center">
                    <Image src={song.cover} rounded fluid style={{ width: "50px", height: "50px", marginRight: "10px" }} />
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