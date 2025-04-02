import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Artist/SideBar/SideBar';
import AdminSidebar from '../../components/Admin/SideBar/SideBar';
import './ArtistLayout.css';

const ArtistLayout = ({ children }) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin'); // Kiểm tra đường dẫn có chứa "/admin"

    return (
        <div className="artist-layout">
            {isAdmin ? <AdminSidebar /> : <Sidebar />}
            <div className="artist-content">
                {children}
            </div>
        </div>
    );
};

export default ArtistLayout;
