import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PlaylistCard.css";
import { FaPlay } from "react-icons/fa";
import { useSong } from "../../context/SongProvider";
import { usePlaylist } from "../../context/PlaylistProvider";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../context/UserDataProvider";
import { useIsVisiableRootModal } from "../../context/IsVisiableRootModal";
import logo from "../../assets/images/white-logo.png";

const PlaylistCard = ({ image, title, description, idSong, idPlaylist, idAlbum, collab }) => {

    const navigate = useNavigate();
    const { isLoggedIn } = useUserData();
    const { setIdSong } = useSong();
    const { playlist, addSong, removeSong, clearPlaylist } = usePlaylist();
    const { setIsVisiableRootModal } = useIsVisiableRootModal();

    const handlePlayClick = () => {
        if (idPlaylist) {
            navigate(`/user/playlist/${idPlaylist}`);
        }
        else {
            if (isLoggedIn) {
                //khi bài hát được phát không trong playlist
                setIdSong(idSong);
                clearPlaylist();
                addSong({ id: idSong });
            }
            else {
                setIsVisiableRootModal(true);
            }
        }
    };

    return (
        <div
            className="card playlist-card text-white position-relative"
            onClick={handlePlayClick}
        >
            <div className="position-relative">
                <img
                    src={image || logo}
                    className="card-img-top"
                    alt={title}
                />
                <div className="card-img-overlay d-flex align-items-end justify-content-between overlay-gradient">
                    <button
                        className="btn rounded-circle play-button"
                        onClick={handlePlayClick}
                    >
                        <FaPlay />
                    </button>
                </div>
            </div>
            <div className="card-body text-center">
                <h6 className="card-title text-truncate m-0" title={title}>{title}</h6>
                <div
                    className="card-text-playlist text-truncate"
                    title={`${description}${Array.isArray(collab) && collab.length > 0 ? `, ${collab.join(', ')}` : ''}`}
                >
                    {description}
                    {Array.isArray(collab) && collab.length > 0 && `, ${collab.join(', ')}`}
                </div>
            </div>
        </div>
    );
};

export default PlaylistCard;