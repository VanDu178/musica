import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header"; // Import Header component


const Home = () => {
    const { t, i18n } = useTranslation();

    return (
        <div>
            <Header /> {/* Thêm Header vào Home */}
            <h1>{t("homepage.content")}</h1>  {/* Lấy nội dung từ transaction.json */}
            <p>Current Language: {i18n.language}</p> {/* Hiển thị ngôn ngữ hiện tại */}
        </div>
    );
};

export default Home;
