import React from "react";
import { useTranslation } from "react-i18next";

const Header = () => {

    const { t, i18n } = useTranslation();

    // Hàm chuyển đổi ngôn ngữ
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header>
            <h1>{t("header.title")}</h1>
            <p>{t("header.subtitle")}</p>
            <button onClick={() => changeLanguage("vi")}>VI</button>
            <button onClick={() => changeLanguage("en")}>EN</button>
        </header>
    );
};

export default Header;
