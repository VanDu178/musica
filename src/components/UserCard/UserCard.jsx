import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlay } from "react-icons/fa";
import { useUserData } from "../../context/UserDataProvider";
import { checkData } from "../../helpers/encryptionHelper";
import "./UserCard.css";

const UserCard = ({ name, image, type }) => {
    const [validRole, setValidRole] = useState(false);
    const { isLoggedIn } = useUserData();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchRole = async () => {
            if (isLoggedIn) {
                const checkedRoleUser = await checkData(3);
                if (checkedRoleUser) {
                    setValidRole(true);
                }
            } else {
                setValidRole(true);
            }
        };

        fetchRole();
    }, [isLoggedIn]);

    if (!validRole) return null;

    return (
        <div className="user-card-container">
            <div className="user-card-position-relative">
                <img
                    src={image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPVMbdDmHvm0DfSI29UxWTtE1IqPCm8xn7Bw&s"}
                    alt={name}
                    className="user-card-img-top"
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