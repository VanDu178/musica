import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import MusicPlayerControls from "../../components/MusicPlayerControls/MusicPlayerControls";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SideBar from "../../components/Sidebar/LeftSideBar";
import "./Main.css";

const Main = ({ children }) => {
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
                    {children}
                    <Footer />
                </div>
            </div>
            <MusicPlayerControls />
        </div>
    );
};

export default Main;