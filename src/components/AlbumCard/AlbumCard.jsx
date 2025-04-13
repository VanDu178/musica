import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlay } from "react-icons/fa";
import "./AlbumCard.css";
import { useNavigate } from "react-router-dom";
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
                    src={image || "../../images/default-music-img.png"}
                    className="card-img-top"
                    alt={title}
                //Nếu đường dẫn image bị lỗi thì lấy ảnh mặc định luôn. 
                // onError={(e) => {
                //     e.target.onerror = null; // tránh vòng lặp nếu fallback cũng lỗi
                //     e.target.src = "../../images/default-music-img.png";
                // }}
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