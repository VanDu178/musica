import React, { useState, useEffect } from "react";
import "./Profile.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { useTranslation } from "react-i18next";



const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

const Profile = () => {
    const navigate = useNavigate(); // Khởi tạo hook điều hướng
    const { t, i18n } = useTranslation();


    const [userData, setUserData] = useState({
        username: "31777qg2623x6jxgr4ebn3anpy7y",
        email: "nhat82955@gmail.com",
        gender: "Nam",
        day: "16",
        month: "6",
        year: "2003",
        country: "Việt Nam",
    });

    const [daysList, setDaysList] = useState([]);

    useEffect(() => {
        const days = Array.from({ length: getDaysInMonth(userData.month, userData.year) }, (_, i) => i + 1);
        setDaysList(days);
    }, [userData.month, userData.year]);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <button className="profile-back-btn" onClick={() => navigate("/account/overview")}>
                    <i className="fas fa-chevron-left"></i>
                </button>
                <h1 className="profile-title">{t("profile.editProfile")}</h1>
            </div>

            <div className="profile-form">
                <label className="profile-label">{t("profile.username")}</label>
                <input
                    className="profile-input"
                    type="email"
                    value={`${userData.email.replace(/^(.{4}).+(@.+)$/, "$1***$2")}`}
                    readOnly
                    disabled
                />

                <label className="profile-label">{t("profile.email")}</label>
                <input
                    className="profile-input"
                    type="email"
                    value={`${userData.email.replace(/^(.{4}).+(@.+)$/, "$1***$2")}`}
                    readOnly
                    disabled
                />
                <label className="profile-label">{t("profile.gender")}</label>
                <select className="profile-input" value={userData.gender} onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
                    <option>{t("profile.male")}</option>
                    <option>{t("profile.female")}</option>
                    <option>{t("profile.other")}</option>
                </select>

                <label className="profile-label">{t("profile.birthday")}</label>
                <div className="profile-birthday-inputs">
                    <select className="profile-input" value={userData.day} onChange={(e) => setUserData({ ...userData, day: e.target.value })}>
                        {daysList.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <select className="profile-input" value={userData.month} onChange={(e) => setUserData({ ...userData, month: e.target.value })}>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{t(`profile.months.${i + 1}`)}</option>
                        ))}
                    </select>
                    <select className="profile-input" value={userData.year} onChange={(e) => setUserData({ ...userData, year: e.target.value })}>
                        {[...Array(new Date().getFullYear() - 1900 + 1)].map((_, i) => (
                            <option key={1900 + i} value={1900 + i}>{1900 + i}</option>
                        )).reverse()}
                    </select>
                </div>

                <label className="profile-label">{t("profile.country")}</label>
                <select className="profile-input" value={userData.country} onChange={(e) => setUserData({ ...userData, country: e.target.value })}>
                    <option>{t("profile.vietnam")}</option>
                </select>

                <div className="profile-button-group">
                    <button
                        className="profile-cancel-btn"
                        onClick={() => navigate("/account/overview")}
                    >
                        {t("profile.cancel")}
                    </button>
                    <button className="profile-save-btn">{t("profile.save")}</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;