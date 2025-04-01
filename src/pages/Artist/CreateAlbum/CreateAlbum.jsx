import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axiosConfig";
import { handleDragStart, handleDrop, handleDragOver } from '../../../helpers/dragDropHelpers';
import { Spinner } from "react-bootstrap"; // Import Spinner
import { useTranslation } from "react-i18next";
import "./CreateAlbum.css";

const CreateAlbum = () => {
    const navigate = useNavigate();
    const [albumName, setAlbumName] = useState("");
    const [albumCover, setAlbumCover] = useState(null);
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [songs, setSongs] = useState([]); // Available songs
    const [selectedSongs, setSelectedSongs] = useState([]); // Selected songs
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation(); // Hook để lấy hàm dịch

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axiosInstance.get("/artist/songs/");
                setSongs(response.data);
            } catch (err) {
                console.error("Failed to load songs:", err);
            }
        };
        fetchSongs();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) setAlbumCover(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Đặt trạng thái loading khi bắt đầu gửi form
        const formData = new FormData();
        formData.append("name", albumName);
        formData.append("description", description);
        if (albumCover) formData.append("cover", albumCover);
        formData.append("songs", JSON.stringify(selectedSongs));
        try {
            const response = await axiosInstance.post("/artist/create-album", formData);
            console.log(response);
            if (response.status == 201) {
                navigate("/artist/albums");
            } else {
                alert("lỗi");
            }
        } catch (err) {
            setError("Failed to create album");
            setLoading(false); // Đặt trạng thái loading thành false khi hoàn tất
        }
    };

    const handleAddSong = (songId) => {
        const songToAdd = songs.find(song => song.id === songId);
        if (songToAdd && !selectedSongs.some(song => song.id === songId)) {
            setSelectedSongs(prev => [...prev, songToAdd]);
            setSongs(prev => prev.filter(song => song.id !== songId));
        }
    };

    const handleRemoveSong = (songId) => {
        const songToRemove = selectedSongs.find(song => song.id === songId);
        if (songToRemove) {
            setSelectedSongs(prev => prev.filter(song => song.id !== songId));
            setSongs(prev => [...prev, songToRemove]);
        }
    };

    // Kiểm tra xem tất cả các trường có giá trị hay không
    const isFormValid = () => {
        return (
            albumName.trim() !== "" && // Tên album không rỗng
            albumCover !== null && // Có ảnh bìa
            description.trim() !== "" && // Mô tả không rỗng
            selectedSongs.length > 0 // Có ít nhất 1 bài hát được chọn
        );
    };

    return (
        <div className="create-album-container">
            <h1>{t('artist.createAlbum.title')}</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="create-album-form">
                <div className="album-form-container">
                    <div className="album-name-cover">
                        <div className="">
                            {albumCover && (
                                <img
                                    src={URL.createObjectURL(albumCover)}
                                    alt="Album Cover"
                                    className="album-preview"
                                />
                            )}
                        </div>
                        <div className="album-cover-container">
                            <label>{t('artist.createAlbum.album_name_label')}</label>
                            <input
                                type="text"
                                value={albumName}
                                onChange={(e) => setAlbumName(e.target.value)}
                                placeholder={t('artist.createAlbum.album_name_placeholder')}
                                required
                            />
                            <label>{t('artist.createAlbum.album_cover_label')}</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            <label>{t('artist.createAlbum.description_label')}</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('artist.createAlbum.description_placeholder')}
                            />
                        </div>
                    </div>
                </div>

                <div className="album-selected-song-list">
                    <h3>{t('artist.createAlbum.selected_songs_title')}</h3>
                    {selectedSongs.length > 0 ? (
                        <ul onDragOver={handleDragOver}>
                            {selectedSongs.map((song, index) => (
                                <li
                                    key={song.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDrop={(e) => handleDrop(e, index, selectedSongs, setSelectedSongs)}
                                >
                                    <span className="song-index">{index + 1}</span>
                                    <span className="drag-handle">≡</span>
                                    <img
                                        src={song.image_path}
                                        alt={song.title}
                                        className="album-artist-song-image"
                                        onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                                    />
                                    <span>{song.title}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSong(song.id)}
                                        className="album-remove-song-button"
                                    >
                                        {t('artist.createAlbum.remove_button')}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>{t('artist.createAlbum.no_selected_songs')}</p>
                    )}
                </div>
                <hr />

                <div className="album-song-list">
                    <h3>{t('artist.createAlbum.your_songs_title')}</h3>
                    {songs.length > 0 ? (
                        <ul>
                            {songs.map((song) => (
                                <li key={song.id}>
                                    <img
                                        src={song.image_path}
                                        alt={song.title}
                                        className="album-artist-song-image"
                                        onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                                    />
                                    <span>{song.title}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleAddSong(song.id)}
                                        className="album-add-song-button"
                                    >
                                        {t('artist.createAlbum.add_button')}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>{t('artist.createAlbum.no_songs')}</p>
                    )}
                </div>

                <hr />

                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading || !isFormValid()} // Disable nếu đang loading hoặc form không hợp lệ
                >
                    {loading ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    ) : (
                        t('artist.createAlbum.submit_button'))}
                </button>
            </form>
        </div>
    );
};

export default CreateAlbum;