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
import VideoItem from "../../components/VideoItem/VideoItem";
import axiosInstance from "../../config/axiosConfig";
import MusicSlider from "../../components/MusicSlider/MusicSlider";
import { useSearch } from "../../context/SearchContext";
import { useSong } from "../../context/SongProvider";
import { useIsPlaying } from "../../context/IsPlayingProvider";
import logo from "../../assets/images/logo.png";

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
    const [videos, setVideos] = useState([]);
    const { searchKeyword, selectedType, setSelectedType, setSearchKeyword } = useSearch();
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isloadingMore, setIsLoadingMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [IsCheckingRole, setIsCheckingRole] = useState(true);
    const { setIdSong } = useSong();
    const { setIsPlaying } = useIsPlaying();


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
        setSongs([]); setPlaylists([]); setAlbums([]); setArtists([]); setUsers([]); setVideos([]);
        if (selectedType == 'all') {
            fetchSongs(newOffset);
            fetchArtists(newOffset);
            fetchPlaylists();
            fetchAlbums(newOffset);
            fetchUsers(newOffset);
            fetchVideos(newOffset);
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
        else if (selectedType == 'video') {
            fetchVideos(newOffset);
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

    const fetchVideos = async (customOffset) => {
        if (customOffset == 0) {
            setLoading(true);
        }
        let limit = 0;
        if (selectedType == 'all') {
            limit = 5;
        } else {
            limit = 8;
        }
        try {
            const response = await axiosInstance.get(`/search/`, {
                params: { selectedType: "videos", searchKeyword, limit, offset: customOffset },
            });
            if (response.data) {
                setVideos((prev) => [...prev, ...response.data]);
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
        if (selectedType == 'video') {
            fetchVideos(newOffset);
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
                    <button
                        className={`custom-btn mx-2 ${selectedType === "video" ? "active" : ""}`}
                        onClick={() => setSelectedType("video")}
                    >
                        {t("home.videos")}
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
                                    < div className="search-song-top-item"
                                        onClick={() => {
                                            if (isLoggedIn) {
                                                setIdSong(songs[0]?.id);
                                                setIsPlaying(true);
                                            }
                                        }}
                                    >
                                        <img
                                            src={songs[0].image_path || logo}
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

                    <div className="container mt-4" >
                        {videos.length > 0 && (
                            <MusicSlider
                                isHiddenFaArrow="true"
                                items={videos}
                                type="video"
                                titleSlider={t("search.videos")}
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
                                        image={playlist.image_path}
                                        title={playlist.name}
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

            {
                selectedType === "video" && (
                    <>
                        <div className="search-list-video">
                            {videos.length > 0 ? (
                                videos.map((video, index) => (
                                    <VideoItem
                                        key={index}
                                        video={video}
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
            {/* kết thúc type video */}

        </div >
    );
};

export default HomeTabs;