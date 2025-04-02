import React from "react";
import "./Loading.css";
import { useTranslation } from "react-i18next";

const Loading = ({ message, height }) => {
    const { t } = useTranslation();

    // Sử dụng message từ props hoặc fallback về translation
    const displayMessage = message || t("utils.loading");

    const textStyle = height ? { height: `${height}vh` } : {};


    return (
        <div className="component-loading-container" style={textStyle}>
            <h2 className="component-loading-text">{displayMessage}</h2>
        </div>
    );
};

// Giá trị mặc định cho prop (optional)
Loading.defaultProps = {
    message: null
};

export default Loading;