import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpotify } from "react-icons/fa";
import { GoBell, GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import "./Components.css";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState(i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setActiveLang(lng);
  };

  const getButtonClass = (lang) => {
    return activeLang === lang ? "hd-lang-on" : "hd-lang-off";
  }

  return (
    <header className="hd-spotify-header">
      <div className="hd-logo">
        <FaSpotify size={32} color="white" title="Spotify" />
        <div className="hd-home-search">
          <button className="hd-home-button"><GoHomeFill color="white" size={36} title="Home" /></button>
          <div className="hd-search-bar">
            <div className="hd-search-icon"><IoSearchOutline size={24} color="white" title="Search" /></div>
            <input type="text" placeholder={t("header2.searchPlaceholder")} />
          </div>
        </div>

      </div>

      <div className="hd-premium-download">
        <nav className="hd-nav-links hd-premium" title={t("header2.upgradeToPremium")}>
          <button>{t("header2.explorePremium")}</button>
        </nav>
        <nav className="hd-nav-links hd-download">
          <button><MdOutlineDownloadForOffline size={20} color="white" />{t("header2.installApp")}</button>
        </nav>
        <nav className="hd-nav-links hd-news com-glow-zoom">
          <button><GoBell size={20} color="white" title={t("header2.news")} /></button>
        </nav>
        <nav className="hd-nav-links hd-language">
          <button className={`${getButtonClass("vi")} glow-zoom`} onClick={() => changeLanguage("vi")} disabled={activeLang === "vi"}>VI</button>
          <button className={`${getButtonClass("en")} glow-zoom`} onClick={() => changeLanguage("en")} disabled={activeLang === "en"}>EN</button>
        </nav>
      </div>

      <div className="hd-user-profile com-vertical-align">
        <img src="https://via.placeholder.com/40" alt="User" />
      </div>
    </header>
  );
};

export default Header;