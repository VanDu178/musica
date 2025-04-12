import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/axiosConfig";
import "./PlaylistModal.css";
import { FaTimes } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useSong } from "../../../context/SongProvider";
import { useTranslation } from "react-i18next";
import { checkData } from "../../../helpers/encryptionHelper";
import { useUserData } from "../../../context/UserDataProvider";
import Forbidden from "../../../components/Error/403/403";
import Loading from "../../../components/Loading/Loading";
import { storeCachedData, getCachedData } from "../../../helpers/cacheDataHelper"


const PlaylistModal = ({ isOpen, onClose, onAddToPlaylists }) => {
    const { t } = useTranslation();
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingbtn, setLoadingBtn] = useState(false);
    const [error, setError] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const { idSong } = useSong();
    const [validRole, setValidRole] = useState(false);
    const { isLoggedIn } = useUserData();
    const [IsCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            setIsCheckingRole(true);
            if (isLoggedIn) {
                //nếu đang login thì check role phải user không
                const checkedRoleUser = await checkData(3);
                if (checkedRoleUser) {
                    setValidRole(true);
                    setIsCheckingRole(false);
                }
            }
            setIsCheckingRole(false);
        };

        fetchRole();
    }, [isLoggedIn]);

    useEffect(() => {
        if (isOpen) {
            fetchPlaylists();
        }
    }, [isOpen]);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/playlist/user/${idSong}/`);
            setPlaylists(response.data);
            console.log("playlist cua user", response.data);
        } catch (err) {
            setError("Không thể tải danh sách playlist.");
        } finally {
            setLoading(false);
        }

    };

    const handleCheckboxChange = (playlistId) => {
        if (loading || loadingbtn) return;  // Nếu đang loading, không cho thay đổi

        setSelectedPlaylists((prev) =>
            prev.includes(playlistId)
                ? prev.filter((id) => id !== playlistId)
                : [...prev, playlistId]
        );
    };
    const handleAddToPlaylists = async () => {
        if (selectedPlaylists.length === 0) return;
        setLoadingBtn(true); // Bắt đầu loading
        try {
            const response = await axiosInstance.post("/playlist/add-song/", {
                song_id: idSong,
                playlists: selectedPlaylists,
            });

            if (response.status === 200 || response.status === 201) {
                setSelectedPlaylists([]); // Reset danh sách chọn
                setLoadingBtn(false); // Kết thúc loading
                onClose();
            } else {
                console.log("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            setLoadingBtn(false); // Kết thúc loading
            console.error("Lỗi khi thêm bài hát:", error);
        }
    };

    const handleCreatePlaylist = async () => {

        if (!newPlaylistName.trim()) return;

        try {
            // Gửi request tạo playlist mới
            const response = await axiosInstance.post("/playlist/create/", {
                name: newPlaylistName,
            });

            const newPlaylist = response.data; // Lấy dữ liệu playlist vừa tạo

            // Cập nhật danh sách playlist & UI
            setPlaylists([...playlists, newPlaylist]);
            setSelectedPlaylists([...selectedPlaylists, newPlaylist.id]);

            setIsCreatingNew(false);
            setNewPlaylistName("");

            //Xóa cache
            const CACHE_KEY = "playlistsLeftSideBar";
            localStorage.removeItem(CACHE_KEY);

        } catch (error) {
            console.log("Lỗi khi tạo playlist hoặc thêm bài hát!");
        }
    };

    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="60" />;
    }

    if (!isOpen) return null;

    if (!validRole || !isLoggedIn) {
        return <Forbidden />;
    }

    return (
        <div className="playlist-modal-overlay" onClick={onClose}>
            <div className="playlist-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="playlist-modal-header">
                    <div className="playlist-modal-header-top">
                        <h2 className="playlist-modal-title">
                            {isCreatingNew ? t("playlistModal.createNew") : t("playlistModal.selectPlaylist")}
                        </h2>
                        <button className="playlist-modal-close-btn" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>
                </div>
                {isCreatingNew ? (
                    <div className="playlist-modal-create">
                        <input
                            type="text"
                            className="playlist-modal-input"
                            placeholder={t("playlistModal.enterPlaylistName")}
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                        />
                        <div className="playlist-modal-footer">
                            <button className="playlist-modal-cancel-btn" onClick={() => setIsCreatingNew(false)}>
                                {t("playlistModal.cancel")}
                            </button>
                            <button className="playlist-modal-add-btn" onClick={handleCreatePlaylist}>
                                {t("playlistModal.savePlaylist")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button className="playlist-modal-create-btn" onClick={() => setIsCreatingNew(true)}>
                            <IoMdAddCircleOutline size={20} color="white" />
                            {t("playlistModal.createNew")}
                        </button>
                        {loading ? (
                            <p className="playlist-modal-loading">{t("playlistModal.loading")}</p>
                        ) : error ? (
                            <p className="playlist-modal-error">{t("playlistModal.errorLoading")}</p>
                        ) : (
                            <ul className="playlist-modal-list">
                                {playlists.length > 0 ? (
                                    playlists.map((playlist) => (
                                        <li
                                            key={playlist.id}
                                            className="playlist-modal-item"
                                            onClick={() => handleCheckboxChange(playlist.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPlaylists.includes(playlist.id)}
                                                onChange={() => handleCheckboxChange(playlist.id)}
                                                onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan ra li
                                            />
                                            <span>{playlist.name}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="playlist-modal-no-playlist">{t("playlistModal.noPlaylist")}</p>
                                )}
                            </ul>
                        )}
                        <div className="playlist-modal-footer">
                            <button
                                className="playlist-modal-add-btn"
                                onClick={handleAddToPlaylists}
                                disabled={loading || loadingbtn}
                            >
                                {loadingbtn ? t("playlistModal.processing") : t("playlistModal.addToPlaylist")}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PlaylistModal;