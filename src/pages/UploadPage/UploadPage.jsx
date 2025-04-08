import React, { useState, useRef, useEffect } from "react";
import { FaSpotify } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import axiosInstance from "../../config/axiosConfig";
import { useTranslation } from "react-i18next";
import MP3Tag from "mp3tag.js";
import 'react-toastify/dist/ReactToastify.css';
import { handleSuccess, handleError } from '../../helpers/toast';
import { checkData } from "../../helpers/encryptionHelper";
import { useUserData } from "../../context/UserDataProvider";
import Forbidden from "../../components/Error/403/403";
import Loading from "../../components/Loading/Loading";

import "./UploadPage.css";

const UploadPage = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [genre, setGenre] = useState("");
    const [image, setImage] = useState(null); // State for image
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null); // Ref for image input
    const [artistCollab, setArtistCollab] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState([]);
    const [query, setQuery] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);
    const [IsCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            setIsCheckingRole(true);
            if (isLoggedIn) {
                //nếu đang login thì check role phải artist không
                const checkedRoleUser = await checkData(2);
                if (checkedRoleUser) {
                    setValidRole(true);
                    setIsCheckingRole(false);
                    fetchArtists();
                }
            }
            setIsCheckingRole(false);
        };

        fetchRole();
    }, [isLoggedIn]);

    const fetchArtists = async () => {
        try {
            const response = await axiosInstance.get(`/artist/fetch-artist-collab/`, {
                params: { name: query }
            });
            setArtistCollab([]);
            setArtistCollab(response.data);
        } catch (err) {
            console.error("Failed to load songs:", err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Extract file name without extension and set it as title
        const fileName = selectedFile.name.replace(/\.mp3$/, "");
        setTitle(fileName);

        // Get duration of the MP3 file
        const reader = new FileReader();
        reader.onload = (event) => {
            const buffer = event.target.result;
            const mp3tag = new MP3Tag(buffer);
            mp3tag.read();
            const audio = new Audio(URL.createObjectURL(selectedFile));
            audio.onloadedmetadata = () => {
                setDuration(Math.round(audio.duration)); // Set duration in seconds and round it
            };
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    const handleAddArtist = (artistId) => {
        const artistToAdd = artistCollab.find(artist => artist.id === artistId);
        if (artistToAdd && !selectedArtist.some(artist => artist.id === artistId)) {
            setSelectedArtist(prev => [...prev, artistToAdd]);
            setArtistCollab(prev => prev.filter(artist => artist.id !== artistId));
        }
    };

    const handleRemoveArtist = (artistId) => {
        const artistToRemove = selectedArtist.find(artist => artist.id === artistId);
        if (artistToRemove) {
            setSelectedArtist(prev => prev.filter(artist => artist.id !== artistId));
            setArtistCollab(prev => [...prev, artistToRemove]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage(t("upload.selectFile"));
            return;
        }

        if (!image) {
            setMessage(t("upload.selectImage"));
            return;
        }

        if (!title || !description || !genre) {
            setMessage(t("upload.fillAllFields"));
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("duration", duration);
        formData.append("genre", genre);
        const artistIds = selectedArtist.map(artist => artist.id);
        formData.append("artist_collab", JSON.stringify(artistIds));
        if (image) {
            formData.append("image", image); // Append image if available
        }

        setUploading(true);
        setMessage("");

        try {
            const response = await axiosInstance.post("/artist/song/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                handleSuccess(t("upload.success"));
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                if (imageInputRef.current) {
                    imageInputRef.current.value = "";
                }
                setFile(null);
                setTitle("");
                setDescription("");
                setDuration("");
                setGenre("");
                setImage(null);
                setSelectedArtist([]);
                setArtistCollab([]);
                setQuery("");
            } else {
                handleError(t("upload.failure"));
            }
        } catch (error) {
            handleError(t("upload.error"));
        } finally {
            setUploading(false);
        }
    };

    // Xử lý khi nhập dữ liệu vào input
    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        // Xóa timeout trước đó nếu có
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Thiết lập timeout mới (500ms sau khi dừng nhập)
        setTypingTimeout(setTimeout(() => {
            if (value.trim()) {
                fetchArtists(); // Gọi API fetch data
            }
        }, 500));
    };

    // Xử lý khi nhấn Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchArtists(); // Gọi API ngay khi nhấn Enter
        }
    };

    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="100" />;
    }

    if (!validRole || !isLoggedIn) {
        return <Forbidden />;
    }

    return (
        <div className="upload-page">
            {/* <Header /> */}
            <div className="upload-content">
                <header className="upload-header">
                    <FaSpotify size={32} color="white" />
                    <h1>{t("upload.title")}</h1>
                </header>
                <div className="upload-container">
                    <div className="upload-row">
                        <label className="upload-label">{t("upload.mp3Placeholder")}</label>
                        <label className="upload-label">{t("upload.imagePlaceholder")}</label>
                    </div>
                    <div className="upload-row">
                        <input
                            type="file"
                            accept="audio/mp3"
                            onChange={handleFileChange}
                            className="upload-input"
                            ref={fileInputRef}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="upload-input"
                            ref={imageInputRef}
                        />
                    </div>
                    <div className="upload-row">
                        <label className="upload-label">{t("upload.titlePlaceholder")}</label>
                        <label className="upload-label">{t("upload.durationPlaceholder")}</label>
                    </div>
                    <div className="upload-row">
                        <input
                            type="text"
                            placeholder={t("upload.titlePlaceholder")}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="upload-input"
                        />
                        <input
                            type="text"
                            placeholder={t("upload.durationPlaceholder")}
                            value={duration}
                            disabled
                            className="upload-input"
                        />

                    </div>
                    <div className="upload-row">
                        <label className="upload-label">{t("upload.genrePlaceholder")}</label>
                        <label className="upload-label">{t("upload.descriptionPlaceholder")}</label>
                    </div>

                    <div className="upload-row">
                        <input
                            type="text"
                            placeholder={t("upload.genrePlaceholder")}
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="upload-input"
                        />
                        <input
                            type="text"
                            placeholder={t("upload.descriptionPlaceholder")}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="upload-input"
                        />
                    </div>

                    <div className="upload-selected-artist-list">
                        <h3>{t('upload.selectedArtistTitle')}</h3>
                        {selectedArtist.length > 0 ? (
                            <ul>
                                {selectedArtist.map((artistCollab, index) => (
                                    <li
                                        key={artistCollab.id}
                                    >
                                        <span>{index + 1}</span>
                                        <img
                                            src={artistCollab.image_path}
                                            alt={artistCollab.title}
                                            className="album-artist-song-image"
                                            onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                                        />
                                        <span>{artistCollab.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveArtist(artistCollab.id)}
                                            className="album-remove-song-button"
                                        >
                                            {t('artist.createAlbum.remove_button')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{t('upload.noSelectedArtists')}</p>
                        )}
                    </div>

                    {message && <p className="upload-message">{message}</p>}
                    <button
                        onClick={handleUpload}
                        className="upload-button"
                        disabled={uploading}
                    >
                        <MdFileUpload size={24} />
                        {uploading ? t("upload.uploading") : t("upload.upload")}
                    </button>

                    <div className="upload-artst-list">
                        <h3>{t('upload.listArtistTitle')}</h3>
                        <input
                            type="text"
                            className="upload-input"
                            placeholder={t('upload.EnterName')}
                            value={query}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                        {artistCollab.length > 0 ? (
                            <ul>
                                {artistCollab.map((artistCollab) => (
                                    <li key={artistCollab.id}
                                    >
                                        <img
                                            src={artistCollab.image_path}
                                            alt={artistCollab.name}
                                            className="album-artist-song-image"
                                            onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                                        />
                                        <span>{artistCollab.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleAddArtist(artistCollab.id)}
                                            className="album-add-song-button"
                                        >
                                            {t('upload.addButton')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{t('upload.noArtists')}</p>
                        )}
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default UploadPage;