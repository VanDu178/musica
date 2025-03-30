import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpotify } from "react-icons/fa";
import { GoBell, GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import "./Header.css";


const Header = () => {
  const { t, i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState(i18n.language);
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useContext(AuthContext);
  const [userPanelState, setUserPanelState] = useState(false);
  const [userImage, setUserImage] = useState("https://via.placeholder.com/40");
  const [username, setUsername] = useState("User");
  const [userId, setUserId] = useState(null);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setActiveLang(lng);
  };

  const getButtonClass = (lang) => {
    return activeLang === lang ? "hd-lang-on" : "hd-lang-off";
  };

  const test = async () => {
    const response = await axiosInstance.get("/user/1/");
    alert(JSON.stringify(response.data));
  };

  //****************** login đã có dữ liệu hàm này bỏ ***********************
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/user/" + userId + "/");
      if (response && response.data) {
        const { image_path, google_id, username } = response.data;
        setUsername(username);
        const path = google_id
          ? `https://lh3.googleusercontent.com/a/${google_id}`
          : image_path ? image_path : "https://via.placeholder.com/40";
        setUserImage(path);

        if (path == null) console.log("No image found for user:", userId);
        else console.log("User image fetched:", path);

        console.log("User data fetched:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && userId)
      fetchUserData();
    console.log("isLoggedIn changed:", isLoggedIn);
  }, [isLoggedIn, userId]);

  const authRedirect = (redirected) => {
    if (isLoggedIn === false)
      navigate("/login");
    else navigate(redirected);
  }

  const toggleUserPanel = () => {
    setUserPanelState((prevState) => !prevState);
  }

  useEffect(() => {
    if (!userPanelState) return;
    const handleClickOutside = (event) => {
      if (!event.target.closest(".hd-user-profile")) {
        setUserPanelState(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userPanelState]);

  return (
    <header className="hd-spotify-header">
      <div className="hd-logo">
        <FaSpotify size={32} color="white" title="Spotify" />
        <div className="hd-home-search">
          <button className="hd-home-button">
            <GoHomeFill color="white" size={36} title="Home" />
          </button>
          <div className="hd-search-bar">
            <div className="hd-search-icon">
              <IoSearchOutline size={24} color="white" title="Search" />
            </div>
            <input type="text" placeholder={t("header2.searchPlaceholder")} />
          </div>
        </div>
      </div>

      <div className="hd-premium-download">
        <nav className="hd-nav-links hd-premium" title={t("header2.upgradeToPremium")}>
          <button onClick={() => navigate("/premium")}>
            <span>{t("header2.explorePremium")}</span>
          </button>
        </nav>
        <nav className="hd-nav-links hd-download">
          <button>
            <MdOutlineDownloadForOffline size={20} color="white" />
            {t("header2.installApp")}
          </button>
        </nav>
        <nav className="hd-nav-links hd-news com-glow-zoom">
          <button>
            <GoBell size={20} color="white" title={t("header2.news")} />
          </button>
        </nav>
        <nav className="hd-nav-links hd-language">
          <button
            className={`${getButtonClass("vi")} glow-zoom`}
            onClick={() => changeLanguage("vi")}
            disabled={activeLang === "vi"}
          >
            VI
          </button>
          <button
            className={`${getButtonClass("en")} glow-zoom`}
            onClick={() => changeLanguage("en")}
            disabled={activeLang === "en"}
          >
            EN
          </button>
        </nav>
      </div>

      {isLoggedIn ? (
        <div className="hd-user-profile com-vertical-align" onClick={toggleUserPanel}>
          <img src={userImage} alt="User" />
          {userPanelState && (
            <div className="hd-user-menu">
              <ul>
                <button onClick={fetchUserData}>{t("header2.account")}</button>
                <button>{t("header2.profile")}</button>
                <button onClick={() => navigate("/premium")}>{t("header2.upgradeToPremium")}</button>
                <button>{t("header2.support")}</button>
                <button>{t("header2.privateSession")}</button>
                <button>{t("header2.setting")}</button>
                <button onClick={logout}>{t("header2.logout")}</button>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <a className="hd-login" href="/login">
          {t("header2.login")}
        </a>
      )}
    </header>
  );
};

export default Header;