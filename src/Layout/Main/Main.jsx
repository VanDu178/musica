import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Main.css"
import Home from "../../pages/Home/Home";
import PlaylistDetail from "../../pages/PlaylistDetail/PlaylistDetail";
import Header from "../../components/Header/footer-header/header";
import Footer from "../../components/Header/footer-header/footer";
import SideBar from "../../components/Sidebar/left_sidebar";
const Main = () => {
    return (
        <div className="container-flud">
            <div className="header">
                <Header />
            </div>
            <div class="container-flud px-2 mt-2">
                <div class="row gx-2">
                    <div class="col-md-3">
                        <SideBar />
                    </div>
                    <div class="col-md-9 main-content">
                        {/* <PlaylistDetail /> */}
                        <Home />
                    </div>
                </div>
                <Footer />

            </div>

        </div>
    );
};
export default Main;