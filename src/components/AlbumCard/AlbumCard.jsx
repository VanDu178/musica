import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlay } from "react-icons/fa";
import "./AlbumCard.css";

const AlbumCard = ({ title, image, artist }) => {
    return (
        <div className="card album-card text-white position-relative">
            <div className="position-relative">
                <img src={image} className="card-img-top" alt={title} />
                <div className="card-img-overlay d-flex align-items-end justify-content-between overlay-gradient">
                    <p></p>
                    <button className="btn rounded-circle play-button">
                        <FaPlay />
                    </button>
                </div>
            </div>
            <div className="card-body text-center">
                <b className="card-title text-truncate m-0" title={title}>{title}</b>
                <p className="card-text text-truncate" title={artist}>{artist}</p>
            </div>
        </div>
    );
};

export default AlbumCard;