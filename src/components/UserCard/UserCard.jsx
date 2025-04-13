import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { useTranslation } from "react-i18next";
import "./UserCard.css";
import { useNavigate } from "react-router-dom";


const UserCard = ({ name, image, type, idUser, isSlider }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const HandleClick = () => {
        navigate(`/user/public-profile/${idUser}`);
    }


    return (
        <div className="user-card-container" onClick={HandleClick}>
            <div className="user-card-position-relative">
                <img
                    src={image || "../../images/default-avt-img.jpeg"}
                    alt={name}
                    className={`${isSlider ? "user-card-img-top-slider" : "user-card-img-top"}`}
                    onError={(e) => {
                        e.target.onerror = null; // tránh vòng lặp nếu fallback cũng lỗi
                        e.target.src = "../../images/default-avt-img.jpeg";
                    }}
                />
            </div>
            <div className="user-card-body">
                <h5 className="user-card-title">{name}</h5>
                <div className="user-card-text">
                    {(type === 'artist') ? t("utils.artist") : t("utils.user")}
                </div>
            </div>
        </div>
    );
};

export default UserCard; 