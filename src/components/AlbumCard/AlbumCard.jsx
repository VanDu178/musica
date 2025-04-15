import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlay } from "react-icons/fa";
import "./AlbumCard.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/white-logo.png";
const AlbumCard = ({ title, image, artist, idAlbum }) => {
    const navigate = useNavigate();

    const handlePlayClick = () => {
        if (idAlbum) {
            navigate(`/user/playlist/${idAlbum}`);
        }
        return;
    }

    return (
        <div
            className="card album-card text-white position-relative"
            onClick={handlePlayClick}
        >
            <div className="position-relative">
                <img
                    src={image || logo}
                    className="card-img-top"
                    alt={title}
                />
                <div className="card-img-overlay d-flex align-items-end justify-content-between overlay-gradient">
                    <p></p>
                    <button className="btn rounded-circle play-button"
                        onClick={handlePlayClick}
                    >
                        <FaPlay />
                    </button>
                </div>
            </div>
            <div className="card-body text-center">
                <h6 className="card-title-album text-truncate m-0" title={title}>{title}</h6>
                <div className="card-text-album text-truncate" title={artist}>{artist}</div>
            </div>
        </div>
    );
};

export default AlbumCard;