import React from 'react';
import Sidebar from '../../components/Artist/SideBar/SideBar';
import './ArtistLayout.css';

const ArtistLayout = ({ children }) => {
    return (
        <div className="artist-layout">
            <Sidebar />
            <div className="artist-content">
                {children}
            </div>
        </div>
    );
};

export default ArtistLayout;