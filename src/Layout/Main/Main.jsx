import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Main.css"
import Home from "../../pages/Home/Home";
import PlaylistDetail from "../../pages/PlaylistDetail/PlaylistDetail";
import Header from "../../components/Header/Header";
const Main = () => {
    return (
        <div className="container-flud">
            <div className="header">
                <Header />
            </div>
            <div class="container-flud px-2 mt-2">
                <div class="row gx-2">
                    <div class="col-md-3">
                        <div class="p-3 border bg-light  bg-primary rounded-3 ">
                            <h4>Sidebar</h4>
                            <ul class="nav flex-column">
                                <li class="nav-item"><a href="#" class="nav-link">Dashboard</a></li>
                                <li class="nav-item"><a href="#" class="nav-link">Profile</a></li>
                                <li class="nav-item"><a href="#" class="nav-link">Settings</a></li>
                                <li class="nav-item"><a href="#" class="nav-link">Logout</a></li>
                            </ul></div>
                    </div>
                    <div class="col-md-9 main-content">
                        {/* <PlaylistDetail /> */}
                        <Home />
                    </div>
                </div>

            </div>

        </div>
    );
};
export default Main;