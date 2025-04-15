import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Button, ListGroup, Image } from "react-bootstrap";
import { FaMusic, FaPause, FaPlay } from "react-icons/fa";
import { useSong } from "../../context/SongProvider";
import { useIsPlaying } from "../../context/IsPlayingProvider";
import { useUserData } from "../../context/UserDataProvider";
import { useIsVisiableRootModal } from "../../context/IsVisiableRootModal";
import logo from "../../assets/images/logo.png";

import "./SongItem.css";

const SongItem = ({ songId, song, isArrange, songOder }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { idSong, setIdSong } = useSong();
    const { isPlaying, setIsPlaying } = useIsPlaying();
    const { isLoggedIn } = useUserData();
    const [songIdIsPlaying, setSongIdIsPlaying] = useState(false);
    const { setIsVisiableRootModal } = useIsVisiableRootModal();

    useEffect(() => {
        if (isLoggedIn) {
            if (idSong === songId) {
                setSongIdIsPlaying(true);
            }
        }

    }, [])

    const handlePlay = () => {
        if (isLoggedIn) {
            setIdSong(songId);
            setIsPlaying(true);
        }
        else {
            //gọi state hiện modal
            setIsVisiableRootModal(true);
        }
    }

    return (
        <ListGroup.Item
            className={`song-item ${idSong === songId && isPlaying ? "active" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Row className="align-items-center"
                onClick={handlePlay}
            >
                {isArrange ? (
                    <Col xs={1}>
                        <span className="songitem-drag-handle">≡</span>
                    </Col>

                ) : (
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

                            <span>
                                {songOder != null ? songOder + 1 : null}
                            </span>
                        )}
                    </Col>
                )
                }
                <Col xs={5} className="d-flex align-items-center">
                    <Image src={song?.image_path || logo} rounded fluid style={{ width: "50px", height: "50px", marginRight: "10px", borderRadius: "5px" }} />
                    <div className="song-info">
                        <div className="song-title">{song?.title}</div>
                        <div className="song-artist">
                            {song?.user}
                            {song?.collab_artists && song?.collab_artists?.length > 0 && (
                                <>
                                    {song?.collab_artists?.map((artist, index) => (
                                        <span key={index}>, {artist}</span>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </Col>
                <Col xs={3}>{song?.album}</Col>
                <Col xs={2}>{song?.duration}</Col>
            </Row>
        </ListGroup.Item >
    );
};


export default SongItem;