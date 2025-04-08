import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MusicPlayerControls from "../../components/MusicPlayerControls/MusicPlayerControls";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SideBar from "../../components/Sidebar/LeftSideBar";
import "./Main.css";
import { useUserData } from "../../context/UserDataProvider";
import Forbidden from "../../components/Error/403/403";
import { checkData } from "../../helpers/encryptionHelper";
import { useLocation } from 'react-router-dom';


const Main = ({ children }) => {
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            if (isLoggedIn) {
                //nếu đang login thì check role phải artist hoặc admin không nếu đúng thì không cho hiển thị
                const checkedRoleArtist = await checkData(2);
                const checkedRoleAdmin = await checkData(1);
                if (checkedRoleArtist || checkedRoleAdmin) {
                    setValidRole(false);
                }
            }
        };

        fetchRole();
    }, [isLoggedIn]);


    if (!validRole) {
        return <Forbidden />;
    }
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
                    < Footer />
                </div>
            </div>
            <MusicPlayerControls />
        </div>
    );
};

export default Main;