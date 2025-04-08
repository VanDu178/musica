import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight, FaList, FaPlay, FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { RiBookShelfFill, RiBookShelfLine } from "react-icons/ri";
import "./LeftSidebar.css";
import { checkData } from "../../helpers/encryptionHelper";
import { useUserData } from "../../context/UserDataProvider";

const libraryItems = [
    { id: 1, type: "playlist", name: "Liked Songs", details: "Playlist • 228 songs", image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D", pinned: true },
    { id: 2, type: "artist", name: "Camellia", details: "Artist", image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D", playing: true },
    { id: 3, type: "artist", name: "BlackY", details: "Artist", image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D" }
];

const Left_Sidebar = () => {
    const categoryRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState("20%");
    const [left_scroll, setLeft_scroll] = useState(0);
    const [right_scroll, setRight_scroll] = useState(1);
    const [display, setDisplay] = useState("flex");
    const [flexDirection, setFlexDirection] = useState("row");
    const [validRole, setValidRole] = useState(false);
    const { isLoggedIn } = useUserData();

    useEffect(() => {
        const fetchRole = async () => {
            if (isLoggedIn) {
                //nếu đang login thì check role phải user không
                const checkedRoleUser = await checkData(3);
                if (checkedRoleUser) {
                    setValidRole(true);
                }
            } else {
                //nếu không login thì hiển thị
                setValidRole(true);
            }
        };

        fetchRole();
    }, [isLoggedIn]);


    const { t } = useTranslation();

    const scrollLeft = () => {
        toggle_scrollButton(0, 1);
        if (categoryRef.current) {
            categoryRef.current.scrollBy({ left: -170, behavior: "smooth" });
        }
    };

    //Scroll button controls
    const scrollRight = () => {
        toggle_scrollButton(1, 0);
        if (categoryRef.current) {
            categoryRef.current.scrollBy({ left: 170, behavior: "smooth" });
        }
    };

    const toggle_scrollButton = (state1, state2) => {
        setLeft_scroll(state1);
        setRight_scroll(state2);
    };

    //nếu không phải role user hoặc chưa đăng nhập không hiển thị
    if (!validRole) {
        return <div style={{ display: 'none' }} />;
    }

    return (
        <div className="ls-left-sidebar" style={{ width: sidebarWidth, paddingInline: sidebarWidth === "56px" ? "4px" : "16px" }}>
            <div style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <div className="ls-library-header" style={{ flexDirection: flexDirection }}>
                    <button className="com-vertical-align ls-library-title com-glow-only" title={t("leftSidebar.expandLib")} >
                        <div>
                            {sidebarWidth === "56px" ? (<RiBookShelfLine size={32} color="white" />) :
                                (<RiBookShelfFill size={32} color="white" />)}
                        </div>
                        <span style={{ display: display }}>{t("leftSidebar.library")}</span>
                    </button>
                    <div className="ls-add-expand com-vertical-align">
                        <button className="com-glow-only com-vertical-align" title={t("leftSidebar.createListDesc")}>
                            <IoMdAdd size={20} color="white" />
                            <span className="ls-create-span" style={{ display: sidebarWidth === "35%" ? "flex" : "none", marginInline: sidebarWidth === "20%" ? "0" : "8px" }}>{t("leftSidebar.createList")}</span>
                        </button>
                    </div>
                </div>
                <div className="ls-category-search" style={{ flexDirection: sidebarWidth === "20%" ? "column" : "row" }}>
                    <div className="ls-category-container" style={{ display: display }}>
                        <button className="ls-scroll-btn ls-left com-glow-zoom com-vertical-align" onClick={scrollLeft} style={{ opacity: left_scroll }}><FaChevronLeft /></button>
                        <div className="ls-category-holder" ref={categoryRef}>
                            <button>{t("leftSidebar.playlists")}</button>
                            <button>{t("leftSidebar.artists")}</button>
                            <button>Albums</button>
                            <button>Podcasts</button>
                        </div>
                        <button className="ls-scroll-btn ls-right com-glow-zoom com-vertical-align" onClick={scrollRight} style={{ opacity: right_scroll }}><FaChevronRight />
                        </button>
                    </div>

                    <div className="ls-search-sort" style={{ display: display }}>
                        <button className="com-glow-only"><FaSearch size={14} color="white" /></button>
                        <button className="ls-sort-btn com-glow-zoom com-vertical-align">
                            <span>{t("leftSidebar.recents")}</span>
                            <FaList />
                        </button>
                    </div>
                </div>
            </div>

            <div className="ls-library-items">
                {libraryItems.map((item) => (
                    <div key={item.id} className={`ls-library-item ${selectedItem === item.id ? "ls-selected" : ""}`} onClick={() => setSelectedItem(item.id)}>
                        <div className="ls-library-item-img com-vertical-align">
                            <div className="ls-img-play-btn"><FaPlay /></div>
                            <img src={item.image} alt={item.name} />
                        </div>
                        <div className="com-vertical-align" style={{ justifyContent: "space-between", display: display }}>
                            <div className="ls-library-item-info">
                                <span className="ls-library-item-name">{item.name}</span>
                                <span className="ls-library-item-details">{item.details}</span>
                            </div>
                            {item.pinned && <span className="ls-pinned" style={{ right: 0 }}>📌</span>}
                            {item.playing && <BsFillVolumeUpFill size={16} color="green" style={{ right: 0 }} />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Left_Sidebar;
