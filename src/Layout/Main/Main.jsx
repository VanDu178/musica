import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import MusicPlayerControls from "../../components/MusicPlayerControls/MusicPlayerControls";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SideBar from "../../components/Sidebar/LeftSideBar";
import Home from "../../pages/Home/Home";
import PlayList from "../../pages/PlaylistDetail/PlaylistDetail";
import "./Main.css";

const Main = () => {
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
                    <Home />
                    {/* <PlayList /> */}
                    <Footer />
                </div>
            </div>
            <MusicPlayerControls />
        </div>

    );
};

export default Main;
