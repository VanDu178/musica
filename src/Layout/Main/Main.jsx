import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { useParams } from "react-router-dom";
import MusicPlayerControls from "../../components/MusicPlayerControls/MusicPlayerControls";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SideBar from "../../components/Sidebar/LeftSideBar";
import Home from "../../pages/Home/Home";
import PlayList from "../../pages/PlaylistDetail/PlaylistDetail";
import "./Main.css";

const Main = () => {
    const { idPlaylist } = useParams(); // Lấy id từ URL

    return (
        <div className="main-container">
            <header className="main-header">
                <Header />
            </header>
            <div className="main-content">
                <div className="sidebar-container">
                    <SideBar />
                </div>
                <div className="main-content-container">
                    {idPlaylist ? <PlayList playlistId={idPlaylist} /> : <Home />} {/* Hiển thị PlayList nếu có id */}
                    <Footer />
                </div>
            </div>
            <MusicPlayerControls />
        </div>
    );
};

export default Main;
