import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Forbidden from "../../components/Error/403/403";
import { useUserData } from "../../context/UserDataProvider";
import { checkData } from "../../helpers/encryptionHelper";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import PlaylistCard from "../../components/PlaylistCard/PlaylistCard";
import Loading from "../../components/Loading/Loading";
import SongItem from "../../components/SongItem/SongItem";
import UserCard from "../../components/UserCard/UserCard";
import axiosInstance from "../../config/axiosConfig";
import MusicSlider from "../../components/MusicSlider/MusicSlider";
import { useSearch } from "../../context/SearchContext";
import "./Search.css";

const HomeTabs = () => {
    const { t } = useTranslation();
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(true);
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [users, setUsers] = useState([]);
    const { searchKeyword, selectedType, setSelectedType, setSearchKeyword } = useSearch();
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isloadingMore, setIsLoadingMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [IsCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            setIsCheckingRole(true);
            if (isLoggedIn) {
                const checkedRoleUser = await checkData(3);
                setValidRole(checkedRoleUser);
                setIsCheckingRole(false);
            } else {
                setValidRole(true);
                setIsCheckingRole(false);
            }
            setIsCheckingRole(false);
        };
        fetchRole();
    }, [isLoggedIn]);

    useEffect(() => {
        // Lấy query parameters từ URL
        const queryParams = new URLSearchParams(window.location.search);
        const keywordFromUrl = queryParams.get("keyword"); // Lấy giá trị của 'keyword'

        if (keywordFromUrl) {
            // Nếu có keyword trên URL, set vào state hoặc thực hiện hành động nào đó
            setSearchKeyword(keywordFromUrl);
        }
    }, []); // Dependency array rỗng để chỉ chạy khi mount

    useEffect(() => {
        if (searchKeyword == "") {
            return;
        }
        setIsLoadingMore(true);
        var newOffset = 0;
        setOffset(newOffset);
        setSongs([]); setPlaylists([]); setAlbums([]); setArtists([]); setUsers([]);
        if (selectedType == 'all') {
            fetchSongs(newOffset);
            fetchArtists(newOffset);
            fetchPlaylists();
            fetchAlbums(newOffset);
            fetchUsers(newOffset);
        } else if (selectedType == 'song') {
            fetchSongs(newOffset);
        }
        else if (selectedType == 'playlist') {
            fetchPlaylists(newOffset);
        }
        else if (selectedType == 'album') {
            fetchAlbums(newOffset);
        }
        else if (selectedType == 'user') {
            fetchUsers(newOffset);
        }
        else {
            fetchArtists(newOffset);
        }
    }, [selectedType, searchKeyword]);

    const fetchArtists = async (customOffset) => {
        if (customOffset == 0) {
            setLoading(true);
        }
        let limit = 0;
        if (selectedType == 'all') {
            limit = 5;
        } else {
            limit = 10;
        }
        try {
            const response = await axiosInstance.get(`/search/`, {
                params: { selectedType: "artists", searchKeyword, limit, offset: customOffset },
            });
            if (response.data) {
                setArtists((prev) => [...prev, ...response.data]);
                if (response.data.length < limit) {
                    setIsLoadingMore(false)
                }
            }
            EndLoading();
        } catch (error) {
            console.error("Error fetching artists: ", error);
            EndLoading();
        } finally {
            EndLoading();
        }
    };

    const EndLoading = () => {
        setLoading(false);
        setLoadingMore(false);
    };

    const fetchSongs = async (customOffset) => {
        if (customOffset == 0) {
            setLoading(true);
        }
        try {
            // So sánh và đặt giá trị cho limit
            let limit;
            if (selectedType == 'all') {
                limit = 3;
            } else {
                limit = 10;
            }
            const response = await axiosInstance.get(`/search/`, {
                params: { selectedType: "songs", searchKeyword, limit, offset: customOffset },
            });
            if (response.data) {
                setSongs((prev) => [...prev, ...response.data]);
                if (response.data.length < limit) {
                    setIsLoadingMore(false)
                }
            }
            EndLoading();
        } catch (error) {
            EndLoading();
            console.error("Error fetching songs: ", error);
        } finally {
            EndLoading();
        }
    };

    const fetchPlaylists = async (customOffset) => {
        if (customOffset == 0) {
            setLoading(true);
        }
        let limit = 0;
        if (selectedType == 'all') {
            limit = 5;
        } else {
            limit = 10;
        }
        try {
            const response = await axiosInstance.get(`/search/`, {
                params: { selectedType: "playlists", searchKeyword, limit, offset: customOffset },
            });

            if (response.data) {
                setPlaylists((prev) => [...prev, ...response.data]);
                if (response.data.length < limit) {
                    setIsLoadingMore(false)
                }
            }
            EndLoading();
        } catch (error) {
            EndLoading();
            console.error("Error fetching playlists: ", error);
        } finally {
            EndLoading();
        }
    };

    const fetchAlbums = async (customOffset) => {
        if (customOffset == 0) {
            setLoading(true);
        }
        let limit = 0;
        if (selectedType == 'all') {
            limit = 5;
        } else {
            limit = 10;
        }
        try {
            const response = await axiosInstance.get(`/search/`, {
                params: { selectedType: "albums", searchKeyword, limit, offset: customOffset },
            });
            if (response.data) {
                setAlbums((prev) => [...prev, ...response.data]);
                if (response.data.length < limit) {
                    setIsLoadingMore(false)
                }
            }
            EndLoading();
        } catch (error) {
            EndLoading();
            console.error("Error fetching albums: ", error);
        } finally {
            EndLoading();
        }
    };

    const fetchUsers = async (customOffset) => {
        if (customOffset == 0) {
            setLoading(true);
        }
        let limit = 0;
        if (selectedType == 'all') {
            limit = 5;
        } else {
            limit = 10;
        }
        try {
            const response = await axiosInstance.get(`/search/`, {
                params: { selectedType: "users", searchKeyword, limit, offset: customOffset },
            });
            if (response.data) {
                setUsers((prev) => [...prev, ...response.data]);
                if (response.data.length < limit) {
                    setIsLoadingMore(false)
                }
            }
            EndLoading();
        } catch (error) {
            EndLoading();
            console.error("Error fetching users: ", error);
        } finally {
            EndLoading();
        }
    };

    const HandleLoadMore = () => {
        setLoadingMore(true);
        var newOffset = offset + 1;
        setOffset(newOffset);
        if (selectedType == 'artist') {
            fetchArtists(newOffset);
        }
        if (selectedType == 'song') {
            fetchSongs(newOffset);
        }
        if (selectedType == 'playlist') {
            fetchPlaylists(newOffset);
        }
        if (selectedType == 'user') {
            fetchUsers(newOffset);
        }
    }

    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="100" />;
    }

    if (!validRole) return <Forbidden />;

    return (
        <div className="search-container">

            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="d-flex justify-content-center">
                    <button
                        className={`custom-btn mx-2 ${selectedType === "all" ? "active" : ""}`}
                        onClick={() => setSelectedType("all")}
                    >
                        {t("home.all")}
                    </button>
                    <button
                        className={`custom-btn mx-2 ${selectedType === "song" ? "active" : ""}`}
                        onClick={() => setSelectedType("song")}
                    >
                        {t("home.music")}
                    </button>
                    <button
                        className={`custom-btn mx-2 ${selectedType === "playlist" ? "active" : ""}`}
                        onClick={() => setSelectedType("playlist")}
                    >
                        {t("home.playlists")}
                    </button>
                    <button
                        className={`custom-btn mx-2 ${selectedType === "album" ? "active" : ""}`}
                        onClick={() => setSelectedType("album")}
                    >
                        {t("home.albums")}
                    </button>
                    <button
                        className={`custom-btn mx-2 ${selectedType === "user" ? "active" : ""}`}
                        onClick={() => setSelectedType("user")}
                    >
                        {t("home.users")}
                    </button>
                    <button
                        className={`custom-btn mx-2 ${selectedType === "artist" ? "active" : ""}`}
                        onClick={() => setSelectedType("artist")}
                    >
                        {t("home.artists")}
                    </button>
                </div>
            </nav>
            {loading && (
                <Loading message={t("utils.loading")} height="60" />
            )}

            {selectedType === "all" && (
                <>
                    {/* load danh sách bài hát */}
                    <div className="search-song-app">
                        {songs[0] && (

                            <h2 className="search-song-heading">{t("search.TopResult")}</h2>
                        )}
                        <div className="search-song-container">
                            {songs[0] && (
                                <>
                                    {/* Bài hát nổi bật */}
                                    < div className="search-song-top-item">
                                        <img
                                            src={songs[0].image_path || "data:image/png;base64,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"}
                                            className="search-song-top-image"
                                        />
                                        <div className="search-song-top-info">
                                            <span className="search-song-top-title">{songs[0].title}</span>
                                            <span className="search-song-top-artist">
                                                {t("search.song")} • {songs[0].user}
                                                {songs[0].collab_artists && songs[0].collab_artists.length > 0 && (
                                                    <>
                                                        {songs[0].collab_artists.map((artist, index) => (
                                                            <span key={index}>, {artist}</span>
                                                        ))}
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Danh sách các bài hát còn lại */}
                            <ul className="search-song-list">
                                {songs.length > 0 && (
                                    <ListGroup variant="flush">
                                        {songs.map((song) => (
                                            <SongItem
                                                key={song.songId}
                                                song={song}
                                                songId={song.id}
                                                className="search-song-item"
                                            />
                                        ))}
                                    </ListGroup>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* load danh sách nghệ sĩ */}
                    <div className="container mt-4">
                        {artists.length > 0 && (
                            <MusicSlider
                                isHiddenFaArrow="true"
                                items={artists}
                                type="artist"
                                titleSlider={t("search.artist")}
                            />
                        )}
                    </div>

                    {/* load danh sách phát */}
                    <div className="playlist-content">
                        {playlists.length > 0 && (
                            <MusicSlider
                                isHiddenFaArrow="true"
                                items={playlists}
                                type="playlists"
                                titleSlider={t("search.playlist")}
                            />
                        )}
                    </div>

                    {/* load album */}
                    <div className="container mt-4">
                        {albums.length > 0 && (
                            <MusicSlider
                                isHiddenFaArrow="true"
                                items={albums}
                                type="album"
                                titleSlider={t("search.albums")}
                            />
                        )}
                    </div>

                    <div className="container mt-4">
                        {users.length > 0 && (
                            <MusicSlider
                                isHiddenFaArrow="true"
                                items={users}
                                type="user"
                                titleSlider={t("search.users")}
                            />
                        )}
                    </div>

                </>
            )
            }
            {/* kết thúc type all */}

            {
                selectedType === "song" && (
                    <>
                        <ul>
                            {songs.length > 0 ? (
                                <ListGroup variant="flush">
                                    {songs.map((song) => (
                                        <SongItem
                                            key={song.songId}
                                            song={song}
                                            songId={song.id}
                                        />
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="text-white">
                                    {t("search.noResult")}
                                </p>
                            )}
                        </ul>
                        {!loadingMore ? (
                            isloadingMore && (
                                <div
                                    className="search-song-btn-loadmore"
                                    onClick={HandleLoadMore}
                                >
                                    {t("search.loadingMore")}
                                </div>
                            )
                        ) : (
                            <Loading message={t("utils.loading")} className="search-margin-top" />
                        )}

                    </>
                )
            }
            {/* kết thúc type song */}

            {
                selectedType === "artist" && (
                    <>
                        <div className="search-list-artist">
                            {artists.length > 0 ? (
                                artists.map((artist, index) => (
                                    <UserCard
                                        key={index}
                                        name={artist.name}
                                        image={artist.image_path}
                                        role_id={artist.role_id}
                                        type="artist"
                                        className="search-artist-card"
                                        idUser={artist.id}
                                    />
                                ))
                            ) : (
                                <p className="text-white">
                                    {t("search.noResult")}
                                </p>
                            )}
                        </div>
                        {!loadingMore ? (
                            isloadingMore && (
                                <div
                                    className="search-song-btn-loadmore"
                                    onClick={HandleLoadMore}
                                >
                                    {t("search.loadingMore")}
                                </div>
                            )
                        ) : (
                            <Loading message={t("utils.loading")} className="search-margin-top" />
                        )}
                    </>
                )
            }
            {/* kết thúc type artist */}

            {
                selectedType === "playlist" && (
                    <>
                        <div className="search-list-playlist">
                            {playlists.length > 0 ? (
                                playlists.map((playlist, index) => (
                                    <PlaylistCard
                                        title={playlist.title}
                                        image={playlist.image_path}
                                        description={playlist.name}
                                        idPlaylist={playlist.id}
                                    />
                                ))
                            ) : (
                                <p className="text-white">
                                    {t("search.noResult")}
                                </p>)}
                        </div>
                        {!loadingMore ? (
                            isloadingMore && (
                                <div
                                    className="search-song-btn-loadmore"
                                    onClick={HandleLoadMore}
                                >
                                    {t("search.loadingMore")}
                                </div>
                            )
                        ) : (
                            <Loading message={t("utils.loading")} className="search-margin-top" />
                        )}
                    </>
                )
            }
            {/* kết thúc type playlist */}

            {
                selectedType === "album" && (
                    <>
                        <div className="search-list-playlist">
                            {albums.length > 0 ? (
                                albums.map((album, index) => (
                                    <AlbumCard
                                        title={album.name}
                                        image={album.image_path}
                                        artist={album.username}//name artist
                                        idAlbum={album.id}
                                    />
                                ))
                            ) : (
                                <p className="text-white">
                                    {t("search.noResult")}
                                </p>
                            )}
                        </div>
                        {!loadingMore ? (
                            isloadingMore && (
                                <div
                                    className="search-song-btn-loadmore"
                                    onClick={HandleLoadMore}
                                >
                                    {t("search.loadingMore")}
                                </div>
                            )
                        ) : (
                            <Loading message={t("utils.loading")} className="search-margin-top" />
                        )}
                    </>
                )
            }
            {/* kết thúc type playlist */}

            {
                selectedType === "user" && (
                    <>
                        <div className="search-list-artist">
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <UserCard
                                        key={index}
                                        name={user.name}
                                        image={user.image_path}
                                        role_id={user.role_id}
                                        type="user"
                                        className="search-artist-card"
                                        idUser={user.id}
                                    />
                                ))
                            ) : (
                                <p className="text-white">
                                    {t("search.noResult")}
                                </p>
                            )}
                        </div>
                        {!loadingMore ? (
                            isloadingMore && (
                                <div
                                    className="search-song-btn-loadmore"
                                    onClick={HandleLoadMore}
                                >
                                    {t("search.loadingMore")}
                                </div>
                            )
                        ) : (
                            <Loading message={t("utils.loading")} className="search-margin-top" />
                        )}

                    </>
                )
            }
            {/* kết thúc type user */}

        </div >
    );
};

export default HomeTabs;