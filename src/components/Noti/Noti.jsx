import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import './Noti.css'; // Import CSS file for styling


const Noti = ({ targetPage, message, time = 5000 }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(targetPage); // Sử dụng targetPage làm đường dẫn chuyển hướng
        }, time);

        return () => clearTimeout(timer); // Dọn dẹp bộ đếm thời gian khi component bị unmount
    }, [navigate, targetPage, time]);

    return (
        <div className="noti-container">
            <div className="noti-content">
                <h1>{t("messages.title")}</h1>
                <p>{message}</p> {/* Hiển thị thông báo từ props */}
            </div>
        </div>
    );
};

export default Noti;