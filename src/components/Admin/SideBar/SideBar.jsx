import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { checkData } from "../../../helpers/encryptionHelper";
import { useUserData } from "../../../context/UserDataProvider";
import { removeCookie } from "../../../helpers/cookiesHelper"
import { removeCachedData } from "../../../helpers/cacheDataHelper";
import './SideBar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [activeLang, setActiveLang] = useState(i18n.language);
    const { isLoggedIn, setIsLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            if (isLoggedIn) {
                //nếu đang login thì check role phải admin không
                const checkedRoleUser = await checkData(1);
                if (checkedRoleUser) {
                    setValidRole(true);
                }
            }
        };

        fetchRole();
    }, [isLoggedIn]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setActiveLang(lng);
    };

    // Danh sách menu items với đường dẫn tương ứng
    const menuItems = [
        { name: t('admin.sidebar.account'), path: '/admin/account' },
        { name: t('admin.sidebar.accountArtist'), path: '/admin/account-artist' },
        { name: t('admin.sidebar.profile'), path: '/admin/my-profile' },
        { name: t('admin.sidebar.planManagement'), path: '/admin/plan-management' },
        { name: t('admin.sidebar.artistRegistrationRequests'), path: '/admin/artist-registration-requests' },
        { name: t('admin.sidebar.accountManagement'), path: '/admin/account-management' },
    ];

    // Hàm xử lý khi nhấp vào menu item
    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = async () => {
        removeCookie();
        removeCachedData("playlistsLeftSideBar");
        setIsLoggedIn(false);
        navigate("/");
    };

    if (!validRole || !isLoggedIn) {
        return null;
    }

    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-logo">
                <h2>{t('admin.sidebar.portal_title')}</h2>
            </div>
            <hr></hr>
            <nav className="admin-sidebar-menu">
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.name}
                            className={`admin-sidebar-menu-item ${location.pathname === item.path ? 'active' : ''
                                }`}
                            onClick={() => handleNavigation(item.path)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            </nav>
            <hr />
            <nav className="admin-sidebar-lang-nav">
                <span className={`lang-toggle-bg ${activeLang === 'en' ? 'move-right' : ''}`}></span>
                <button
                    className={`admin-sidebar-lang-button ${activeLang === 'vi' ? 'active' : ''}`}
                    onClick={() => changeLanguage('vi')}
                    disabled={activeLang === 'vi'}
                >
                    VI
                </button>
                <button
                    className={`admin-sidebar-lang-button ${activeLang === 'en' ? 'active' : ''}`}
                    onClick={() => changeLanguage('en')}
                    disabled={activeLang === 'en'}
                >
                    EN
                </button>
            </nav>
            {/* Nút Logout */}
            <div className="admin-sidebar-logout">
                <button className="admin-sidebar-logout-button" onClick={handleLogout}>
                    {t('utils.logout')}
                </button>
            </div>

        </div>
    );
};

export default Sidebar;