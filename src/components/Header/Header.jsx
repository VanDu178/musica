import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t, i18n } = useTranslation();
    const [activeLang, setActiveLang] = useState(i18n.language);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setActiveLang(lng); // Cập nhật trạng thái ngôn ngữ hiện tại
    };

    return (
        <header>
            <h1>{t("header.title")}</h1>
            <p>{t("header.subtitle")}</p>
            <button onClick={() => changeLanguage("vi")} disabled={activeLang === "vi"}>VI</button>
            <button onClick={() => changeLanguage("en")} disabled={activeLang === "en"}>EN</button>
        </header>
    );
};

export default Header;
