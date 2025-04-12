import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpotify } from "react-icons/fa";
import { GoBell, GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserData } from "../../context/UserDataProvider";
import { useUser } from "../../context/UserProvider";
import { useSearch } from "../../context/SearchContext";
import { useIsVisiableRootModal } from "../../context/IsVisiableRootModal";
import Cookies from "js-cookie";
import { checkData } from "../../helpers/encryptionHelper";
import { removeCookie } from "../../helpers/cookiesHelper";
import { removeCachedData } from "../../helpers/cacheDataHelper";
import "./Header.css";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, setIsLoggedIn, userData } = useUserData();
  const [activeLang, setActiveLang] = useState(i18n.language);
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserInfo } = useUser();
  const [userPanelState, setUserPanelState] = useState(false);
  const [validRole, setValidRole] = useState(false);
  const { setSearchKeyword } = useSearch();
  const { setIsVisiableRootModal } = useIsVisiableRootModal();

  const inputRef = useRef(null); // Tạo ref để theo dõi input

  const isHomePage = location.pathname === "/user" && inputRef?.current?.value === "";
  const isPremium = Cookies.get('is_premium') === 'true' ? true : false;

  useEffect(() => {
    const fetchRole = async () => {
      if (isLoggedIn) {
        getUserInfo();
        //nếu đang login thì check role phải user không
        const checkedRoleUser = await checkData(3);
        if (checkedRoleUser) {
          setValidRole(true);
        }
      } else {
        //nếu không login thì hiển thị
        setValidRole(true);
      }
    };

    fetchRole();
  }, [isLoggedIn]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setActiveLang(lng);
  };

  const getButtonClass = (lang) => {
    return activeLang === lang ? "hd-lang-on" : "hd-lang-off";
  };

  const toggleUserPanel = () => {
    setUserPanelState((prevState) => !prevState);
  }

  const logout = async () => {
    removeCookie();
    removeCachedData("playlistsLeftSideBar");
    setIsLoggedIn(false);
  };

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

  // Hàm xử lý khi cần lấy giá trị từ input
  const handleSearch = () => {
    const searchValue = inputRef?.current?.value?.trim(); // Lấy giá trị từ input và loại bỏ khoảng trắng thừa
    setSearchKeyword(searchValue);

    if (searchValue) { // Kiểm tra nếu searchValue có giá trị (khác undefined, null, hoặc chuỗi rỗng)
      navigate(`/user/search?keyword=${encodeURIComponent(searchValue)}`);
    }
    else {
      navigate(`/user`);
    }
  };

  const handleNavigatePremium = () => {
    if (isLoggedIn) {
      navigate("/user/premium")
    }
    else {
      setIsVisiableRootModal(true);
    }
  }

  if (!validRole) {
    return <div style={{ display: 'none' }} />;
  }

  return (
    <header className="hd-spotify-header">
      <div className="hd-logo">
        <FaSpotify
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = ""; // Reset giá trị input qua ref
              handleSearch();
            }
            // Điều hướng đến trang /user
            navigate("/user");
          }}
          size={32}
          color="white"
          title="Spotify"
        />

        <div className="hd-home-search">
          <button
            className="hd-home-button"
            onClick={() => {
              if (inputRef.current) {
                console.log(inputRef.current.value); // In giá trị input ra console
                inputRef.current.value = ""; // Reset giá trị input qua ref
                handleSearch();
              }
              // Điều hướng đến trang /user
              navigate("/user");
            }}
            style={{
              backgroundColor: isHomePage ? "white" : "transparent",
              color: isHomePage ? "black" : "white",
              transform: "scale(0.8)", // Thu nhỏ 90%
              transition: "transform 0.2s ease-in-out", // Thêm hiệu ứng mượt
            }}
          >
            <GoHomeFill
              color={isHomePage ? "black" : "white"}
              size={36}
              title="Home"
            />
          </button>
          <div className="hd-search-bar">
            <div className="hd-search-icon">
              <IoSearchOutline size={24} color="white" title="Search" />
            </div>
            <input
              type="text"
              placeholder={t("header2.searchPlaceholder")}
              // onChange={(e) => changeSearch(e.target.value)}
              ref={inputRef} // Gán ref vào input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(); // Gọi tìm kiếm khi nhấn Enter
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="hd-premium-download">
        {isPremium ? (
          // Nếu is_premium là true, hiển thị "Premium User"
          <nav className="hd-nav-links hd-download">
            Premium User
          </nav>

        ) : (
          // Nếu không, hiển thị nút "Upgrade to Premium"
          <nav className="hd-nav-links hd-premium" title={t("header2.upgradeToPremium")}>
            <button onClick={handleNavigatePremium}>
              <span>{t("header2.explorePremium")}</span>
            </button>
          </nav>
        )}

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
          <img src={userData.image_path ? userData.image_path : "../../images/default-avt-img.jpeg"} alt="User"
            onError={(e) => {
              e.target.onerror = null; // tránh vòng lặp nếu fallback cũng lỗi
              e.target.src = "../../images/default-avt-img.jpeg";
            }}
          />
          {userPanelState && (
            <div className="hd-user-menu">
              <ul>
                <button onClick={() => { navigate("/account/overview"); }}>{t("header2.account")}</button>
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

    </header >
  );
};

export default Header;