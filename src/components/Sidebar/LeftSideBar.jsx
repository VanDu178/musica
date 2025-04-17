import React, { useRef, useState, useEffect, use } from "react";
import { useTranslation } from "react-i18next";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight, FaList, FaPlay, FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { RiBookShelfFill, RiBookShelfLine } from "react-icons/ri";
import "./LeftSidebar.css";
import { useUserData } from "../../context/UserDataProvider";
import axiosInstance from "../../config/axiosConfig";
import { storeCachedData, getCachedData } from "../../helpers/cacheDataHelper"
import { useAsyncError, useNavigate } from "react-router-dom";
import logo from "../../assets/images/white-logo.png";
import avtDefault from "../../assets/images/default-avt-img.jpeg";


const Left_Sidebar = () => {
    const navigate = useNavigate();
    const categoryRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState("20%");
    const [left_scroll, setLeft_scroll] = useState(0);
    const [right_scroll, setRight_scroll] = useState(1);
    const [display, setDisplay] = useState("flex");
    const [flexDirection, setFlexDirection] = useState("row");
    const { userData, isLoggedIn } = useUserData();
    const [isLoading, setLoading] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);
    const defaultVisibleCount = 5;
    const [visibleCount, setVisibleCount] = useState(defaultVisibleCount);
    const [selected, setSelected] = useState('playlist');
    const [conversations, setConversations] = useState([]);
    const [pageSize, setPageSize] = useState(20);
    const [nextUrl, setNextUrl] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [readed, setReaded] = useState(false);

    useEffect(() => {
        if (selected == 'playlists') {
            fetchPlaylists();
        }
        if (selected == 'conversations') {
            fetchConversations();
        }

    }, [selected]);

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


    //Hàm gọi xuống db để lấy dữ liệu playlist của tk user đó.
    const fetchPlaylists = async () => {
        setLoading(true);
        const CACHE_KEY = "playlistsLeftSideBar";
        const CACHE_DURATION = 2 * 60 * 60 * 1000;
        const cachedData = getCachedData(CACHE_KEY, CACHE_DURATION);
        if (cachedData) {
            setPlaylists(cachedData.playlists);
            setLoading(false);
            return;
        }
        try {
            const response = await axiosInstance.get(`/playlist/user/`);
            if (response?.status === 200) {
                setPlaylists(response?.data);
                const playlistsData = {
                    playlists: response?.data
                }
                storeCachedData(CACHE_KEY, playlistsData);
            }
        } catch (err) {
            setError("Không thể tải danh sách playlist.");
        } finally {
            setLoading(false);
        }

    };

    const fetchConversations = async (url = `/conversations/user/?page=1&page_size=${pageSize}/`) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(url);
            console.log(response.data);
            setReaded(response?.data?.results?.last_message?.is_read)
            const data = response.data;
            if (url.includes("page=1")) {
                setConversations(data.results); // lần đầu → set luôn
            } else {
                setConversations(prev => [...prev, ...data.results]); // load thêm
            }

            setNextUrl(data.next);           // link tiếp theo
            setHasMore(!!data.next);         // nếu có next thì còn data
        } catch (err) {
            setError("Không thể tải danh sách cuộc hội thoại.");
        } finally {
            setLoading(false);
        }
    };


    const handleConversationClick = async (otherUser, conversationId) => {

        try {
            await axiosInstance.post(`/conversations/mark-read/${conversationId}/`);
            // Cập nhật state conversations
            setConversations((prevConversations) =>
                prevConversations.map((conv) =>
                    conv.id === conversationId ? { ...conv, has_unread: false } : conv
                )
            );
        } catch (error) {
            console.error('Lỗi khi đánh dấu đã đọc:', error);
        }
        // Điều hướng sang trang chat
        navigate("/user/chat", {
            state: {
                otherUserId: otherUser?.id + "",
                otherUserName: otherUser?.name || null,
                otherUserAVT: otherUser?.image_path || null,
            },
        });
    };


    const handleLoadMore = async () => {
        const CACHE_KEY = "playlistsLeftSideBar";
        const CACHE_DURATION = 2 * 60 * 60 * 1000;
        const cachedData = getCachedData(CACHE_KEY, CACHE_DURATION);

        const nextCount = visibleCount + 5;

        if (!cachedData || cachedData.playlists.length < nextCount) {
            // Cache không đủ hoặc không tồn tại → gọi API để lấy thêm
            await fetchPlaylists(); // append = true
        }

        setVisibleCount(nextCount);
    };

    return (
        <div className="ls-left-sidebar" style={{ width: sidebarWidth, paddingInline: sidebarWidth === "56px" ? "4px" : "16px" }}>
            {/* Giữ nguyên phần header và category */}
            <div style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <div className="ls-library-header" style={{ flexDirection: flexDirection }}>
                    <button className="com-vertical-align ls-library-title com-glow-only" title={t("leftSidebar.expandLib")}>
                        <div>
                            {sidebarWidth === "56px" ? <RiBookShelfLine size={32} color="white" /> : <RiBookShelfFill size={32} color="white" />}
                        </div>
                        <span style={{ display: display }}>{t("leftSidebar.library")}</span>
                    </button>
                    <div className="ls-add-expand com-vertical-align">
                        {/* <button className="com-glow-only com-vertical-align" title={t("leftSidebar.createListDesc")}>
                            <IoMdAdd size={20} color="white" />
                            <span className="ls-create-span" style={{ display: sidebarWidth === "35%" ? "flex" : "none", marginInline: sidebarWidth === "20%" ? "0" : "8px" }}>
                                {t("leftSidebar.createList")}
                            </span>
                        </button> */}
                    </div>
                </div>

                <div className="ls-category-search" style={{ flexDirection: sidebarWidth === "20%" ? "column" : "row" }}>
                    {isLoggedIn && (
                        <div className="ls-category-container" style={{ display: display }}>
                            <button className="ls-scroll-btn ls-left com-glow-zoom com-vertical-align" onClick={scrollLeft} style={{ opacity: left_scroll }}>
                                <FaChevronLeft />
                            </button>

                            <div className="ls-category-holder" ref={categoryRef}>
                                <button
                                    onClick={() => setSelected('playlists')}
                                    className={selected === 'playlists' ? 'selected' : ''}
                                >
                                    {t('leftSidebar.playlists')}
                                </button>
                                <button
                                    onClick={() => setSelected('conversations')}
                                    className={selected === 'conversations' ? 'selected' : ''}
                                >
                                    {t('leftSidebar.conversations')}
                                </button>
                            </div>
                            <button className="ls-scroll-btn ls-right com-glow-zoom com-vertical-align" onClick={scrollRight} style={{ opacity: right_scroll }}>
                                <FaChevronRight />
                            </button>
                        </div>
                    )
                    }
                    <div className="ls-search-sort" style={{ display: display }}>
                        <button className="com-glow-only">
                            <FaSearch size={14} color="white" />
                        </button>
                        <button className="ls-sort-btn com-glow-zoom com-vertical-align">
                            <span>{t("leftSidebar.recents")}</span>
                            <FaList />
                        </button>
                    </div>
                </div>
            </div>

            <div className="ls-library-items">
                {selected === 'playlists' && Array.isArray(playlists) && playlists.length > 0 && (
                    playlists.slice(0, visibleCount).map((item) => (
                        <div
                            key={item?.id}
                            className={`ls-library-item ls-playlist-item ${selectedItem === item?.id ? "ls-selected" : ""}`}
                            onClick={() => {
                                setSelectedItem(item?.id);
                                navigate(`/user/playlist/${item?.id}`);
                            }}
                        >
                            <div className="ls-library-item-img com-vertical-align">
                                <div className="ls-img-play-btn">
                                    <FaPlay />
                                </div>
                                <img
                                    src={item?.image_path || logo}
                                    alt={item?.name}
                                />
                            </div>
                            <div className="com-vertical-align" style={{ justifyContent: "space-between", display: display }}>
                                <div className="ls-library-item-info">
                                    <span className="ls-library-item-name">{item?.name}</span>
                                    <span className="ls-library-item-details">{item?.description || t("leftSidebar.defaultPlaylistDesc")}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {selected === 'conversations' && conversations?.length > 0 && (
                    conversations?.map((conv) => {


                        const otherUser = conv?.other_user ?? null;

                        const lastMessage = conv.last_message;

                        return (
                            <div
                                key={conv?.id}
                                className="ls-library-item ls-conversation-item"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #e0e0e0',
                                }}
                                onClick={() => {
                                    handleConversationClick(otherUser, conv?.id);
                                    setReaded(true);
                                }}
                            >

                                <div div style={{ position: 'relative', marginRight: '10px' }}>
                                    <img
                                        src={otherUser.image_path || avtDefault}
                                        alt={otherUser?.name}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                    />
                                </div>


                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>{otherUser?.name}</div>
                                    <div style={{ fontSize: '0.9em', color: '#b3b3b3' }}>
                                        {lastMessage ? lastMessage?.content : 'Chưa có tin nhắn'}
                                    </div>
                                </div>

                                {/* {!readed && (
                                    <span
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: '#1DB954',
                                            borderRadius: '50%',
                                            marginLeft: '8px',
                                        }}
                                    ></span>
                                )} */}
                            </div>
                        );
                    })
                )}

                {selected === "conversations" && hasMore && (
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <button
                            className="com-glow-only"
                            onClick={() => fetchConversations(nextUrl)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                background: "#222",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            {t("leftSidebar.showMore")}
                        </button>
                    </div>
                )}



            </div >

            <div style={{ textAlign: "center", marginTop: "10px" }}>
                {visibleCount < playlists.length ? (
                    <button
                        className="com-glow-only"
                        onClick={handleLoadMore}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            background: "#222",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        {t("leftSidebar.showMore")}
                    </button>
                ) : visibleCount > defaultVisibleCount ? (
                    <button
                        className="com-glow-only"
                        onClick={() => setVisibleCount(defaultVisibleCount)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            background: "#444",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        {t("leftSidebar.showLess")}
                    </button>
                ) : null}
            </div>
        </div >
    );
};

export default Left_Sidebar;
