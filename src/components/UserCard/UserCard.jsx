import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { useTranslation } from "react-i18next";
import "./UserCard.css";
import { useNavigate } from "react-router-dom";
import avtDefault from "../../assets/images/default-avt-img.jpeg";


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
                    src={image || avtDefault}
                    alt={name}
                    className={`${isSlider ? "user-card-img-top-slider" : "user-card-img-top"}`}
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