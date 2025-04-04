import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SideBar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [activeLang, setActiveLang] = useState(i18n.language);
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setActiveLang(lng);
    };

    // Danh sách menu items với đường dẫn tương ứng
    const menuItems = [
        { name: t('admin.sidebar.account'), path: '/admin/account' },
        { name: t('admin.sidebar.accountArtist'), path: '/admin/account-artist' },
        { name: t('admin.sidebar.artistRegistrationRequests'), path: '/admin/artist-registration-requests' },
        { name: t('admin.sidebar.accountManagement'), path: '/admin/account-management' },
    ];

    // Hàm xử lý khi nhấp vào menu item
    const handleNavigation = (path) => {
        navigate(path);
    };

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

        </div>
    );
};

export default Sidebar;