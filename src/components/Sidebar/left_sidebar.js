import React, { useRef, useState } from "react";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight, FaList, FaPlay, FaSearch } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { RiBookShelfFill, RiBookShelfLine } from "react-icons/ri";
import "./components.css";

const libraryItems = [
    { id: 1, type: "playlist", name: "Liked Songs", details: "Playlist • 228 songs", image: "https://i.imgur.com/yourimage.png", pinned: true },
    { id: 2, type: "artist", name: "Camellia", details: "Artist", image: "https://i.imgur.com/yourimage.png", playing: true },
    { id: 3, type: "artist", name: "BlackY", details: "Artist", image: "https://i.imgur.com/yourimage.png" },
    { id: 4, type: "artist", name: "Hoshimachi Suisei", details: "Artist", image: "https://i.imgur.com/yourimage.png" },
    { id: 5, type: "artist", name: "Liked Songs", details: "Artist", image: "https://i.imgur.com/yourimage.png"},
    { id: 6, type: "artist", name: "Camellia", details: "Artist", image: "https://i.imgur.com/yourimage.png", playing: true },
    { id: 7, type: "artist", name: "BlackY", details: "Artist", image: "https://i.imgur.com/yourimage.png" },
    { id: 8, type: "artist", name: "Hoshimachi Suisei", details: "Artist", image: "https://i.imgur.com/yourimage.png" },
];

const Left_Sidebar = () => {
    const categoryRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState("250px");
    const [left_scroll, setLeft_scroll] = useState(0);
    const [right_scroll, setRight_scroll] = useState(1);
    // const [createSpanWidth, setCreateSpanWidth] = useState("0px");
    const [display, setDisplay] = useState("flex");
    const [flexDirection, setFlexDirection] = useState("row");

    const scrollLeft = () => {
        toggle_scrollButton(0,1);
        if (categoryRef.current) {
            categoryRef.current.scrollBy({ left: -170, behavior: "smooth" });
        }
    };

    const toggle_flexDirection = () => {
        setFlexDirection((direction) => (direction === "row" ? "column" : "row"));
    }

    //Scroll button controls
    const scrollRight = () => {
        toggle_scrollButton(1,0);
        if (categoryRef.current) {
            categoryRef.current.scrollBy({ left: 170, behavior: "smooth" });
        }
    };

    const toggle_scrollButton = (state1, state2) => {
        setLeft_scroll(state1);
        setRight_scroll(state2);
    };

    // Opacity: 0 <=> 1
    const toggle_display = () => {
        setDisplay((prevDisplay) => (prevDisplay === "flex" ? "none" : "flex"));
    };

    //Toggle "create" text in add button
    // const toggle_spanWidth = () => {
    //     setTimeout(() => {
    //         setCreateSpanWidth((prevWidth) => (prevWidth === "0px" ? "auto" : "0px"));
    //     }, 50);
    // };

    // 250px <=> 550px
    const toggle_sidebarWidth = () => {
        setSidebarWidth((prevWidth) => (prevWidth === "250px" ? "550px" : "250px"));
        // toggle_spanWidth();
        if(sidebarWidth==="250px") toggle_scrollButton(0,0);
            else toggle_scrollButton(0,1);
        // toggle_display();
    };
    // any <=> 40px
    const toggle_sidebarWidth2 = () => {
        setSidebarWidth((prevWidth) => (prevWidth === "56px" ? "250px" : "56px"));
        // toggle_libraryInfoWidth();
        toggle_display();
        toggle_flexDirection();
    };

    return (
        <div className="left-sidebar" style={{ width: sidebarWidth, paddingInline: sidebarWidth==="56px"?"4px":"16px"}}>
            <div style={{position: "sticky", top: 0, zIndex: 1}}>
                <div className="vertical-align library-header" style={{flexDirection: flexDirection}}>
                    <button className="vertical-align library-title glow-only"  onClick={toggle_sidebarWidth2}>
                        <div>
                            {sidebarWidth === "56px" ? (<RiBookShelfLine size={32} color="white"/>):
                            (<RiBookShelfFill size={32} color="white"/>)}
                        </div>
                        <span style={{display: display}}>Your Library</span>
                    </button>
                    <div className="add-expand vertical-align">
                        <button className="glow-only vertical-align">
                            <IoMdAdd size={20} color="white" />
                            <span className="create-span" style={{ display: sidebarWidth==="250px"?"none":"flex", marginInline: sidebarWidth==="250px"?"0":"8px"}}>Create</span>
                        </button>
                        <button className="glow-only" style={{ backgroundColor: "rgba(0,0,0,0)", display: display}} onClick={toggle_sidebarWidth}>
                            <FaArrowRight size={20} color="#8a8a8a" style={{ transform: sidebarWidth === "250px" ? "rotate(0deg)" : "rotate(180deg)" }} />
                        </button>
                    </div>
                </div>
                <div className="category-search" style={{flexDirection:sidebarWidth==="250px"?"column":"row"}}>
                    <div className="category-container" style={{display:display}}>
                        <button className="scroll-btn left glow-zoom vertical-align" onClick={scrollLeft} style={{opacity:left_scroll}}><FaChevronLeft /></button>
                        <div className="category-holder" ref={categoryRef}>
                            <button>Playlists</button>
                            <button>Artists</button>
                            <button>Albums</button>
                            <button>Podcasts and Shows</button>
                        </div>
                        <button className="scroll-btn right-positioned glow-zoom vertical-align" onClick={scrollRight} style={{opacity:right_scroll}}><FaChevronRight/>
                        </button>
                    </div>

                    <div className="search-sort" style={{display: display}}>
                        <button className="glow-only"><FaSearch size={14} color="white" /></button>
                        <button className="sort-btn glow-zoom vertical-align">
                            <span>Recents </span>
                            <FaList />
                        </button>
                    </div>
                </div>
            </div>

            <div className="library-items">
                {libraryItems.map((item) => (
                    <div key={item.id} className={`library-item ${selectedItem === item.id ? "selected" : ""}`} onClick={() => setSelectedItem(item.id)}>
                        <div className="library-item-img vertical-align">
                            <div className="img-play-btn"><FaPlay /></div>
                            <img src={item.image} alt={item.name} />
                        </div>
                        <div className="vertical-align" style={{justifyContent: "space-between", display: display}}>
                            <div className="library-item-info">
                                <span className="library-item-name">{item.name}</span>
                                <span className="library-item-details">{item.details}</span>
                            </div>
                            {item.pinned && <span className="pinned" style={{right: 0}}>📌</span>}
                            {item.playing && <BsFillVolumeUpFill size={16} color="green" style={{right:0}}/>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Left_Sidebar;
