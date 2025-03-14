import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MusicSlider from "../../components/MusicSlider/MusicSlider";
import "./Home.css"
import { useTranslation } from "react-i18next";

const Home = () => {
    const { t } = useTranslation();
    const playlists = [
        {
            id: 1,
            title: "My Playlist 1",
            description: "This is my favorite playlist 1.",
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 2,
            title: "My Playlist 2",
            description: "This is my favorite playlist 2.",
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 3,
            title: "My Playlist 3",
            description: "This is my favorite playlist 3.",
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 4,
            title: "My Playlist 1",
            description: "This is my favorite playlist 1.",
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 5,
            title: "My Playlist 2",
            description: "This is my favorite playlist 2.",
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 6,
            title: "My Playlist 3",
            description: "This is my favorite playlist 3.",
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 5,
            title: "My Playlist 2",
            description: "This is my favorite playlist 2.",
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 6,
            title: "My Playlist 3",
            description: "This is my favorite playlist 3.",
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
        }
    ];



    const albums = [
        { id: 1, title: "Album 1", artist: "Ca sĩ A", image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRo-GQtwNUn-6cyJcDjmbMjLC4RLQQpohfyyzFA6b3g56ykoo3DcxKUPgrSt9dJU4RY1KqJg2KrBBL8-auh6VTuzHP6gscLVGG37rxEeQ" },
        { id: 2, title: "Album 2", artist: "Ca sĩ B", image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRo-GQtwNUn-6cyJcDjmbMjLC4RLQQpohfyyzFA6b3g56ykoo3DcxKUPgrSt9dJU4RY1KqJg2KrBBL8-auh6VTuzHP6gscLVGG37rxEeQ" },
    ];

    return (

        <div className="col home-content">
            <div className="p-3 border rounded-3 home-content">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="d-flex justify-content-center">
                        {/* Các button sử dụng dịch từ i18n */}
                        <button className="custom-btn active mx-2">{t("home.all")}</button>
                        <button className="custom-btn mx-2">{t("home.music")}</button>
                        <button className="custom-btn mx-2">{t("home.playlists")}</button>
                    </div>
                </nav>

                <div>
                    <div className="card-group card-group-scroll">
                        <MusicSlider items={playlists} type="playlist" />
                    </div>
                    <div className="card-group card-group-scroll">
                        <MusicSlider items={albums} type="album" />
                    </div>
                </div>
            </div>
        </div>

    );
};
export default Home;