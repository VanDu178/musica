import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PlaylistCard.css";
import { FaPlay } from "react-icons/fa";



const PlaylistCard = ({ image, title, description }) => {
    return (
        <div className="card playlist-card text-white position-relative">
            <div className="position-relative">
                <img src={image} className="card-img-top" alt={title} />
                <div className="card-img-overlay d-flex align-items-end justify-content-between overlay-gradient">
                    <h5 className="card-title text-truncate m-0" title={title}>{title}</h5>
                    <button className="btn rounded-circle play-button">
                        <FaPlay />
                    </button>
                </div>
            </div>
            <div className="card-body text-center">
                <p className="card-text text-truncate" title={description}>{description}</p>
            </div>
        </div>
    );
};


export default PlaylistCard;