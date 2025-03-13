import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Footer from "../../components/Header/Footer-Header/footer";
import Header from "../../components/Header/Footer-Header/header";
import SideBar from "../../components/Sidebar/Left_sidebar";
import Home from "../../pages/Home/Home";
import "./Main.css";
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