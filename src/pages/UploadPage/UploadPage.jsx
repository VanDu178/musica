import React, { useState, useRef } from "react";
import { FaSpotify } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import axiosInstance from "../../config/axiosConfig";
import Header from "../../components/Header/Header"; // Import Header component
import Footer from "../../components/Footer/Footer"; // Import Footer component
import { useTranslation } from "react-i18next";
import MP3Tag from "mp3tag.js";
import 'react-toastify/dist/ReactToastify.css';
import { handleSuccess, handleError } from '../../helpers/toast';
import { Toast } from 'react-toastify';
import "./UploadPage.css";

const UploadPage = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [album, setAlbum] = useState("");
    const [duration, setDuration] = useState("");
    const [genre, setGenre] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef(null); // Tạo ref cho input file
    const user_id = 1;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

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

    const handleUpload = async () => {
        if (!file) {
            setMessage(t("upload.selectFile"));
            return;
        }

        if (!title || !album || !genre) {
            setMessage(t("upload.fillAllFields"));
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("album", album);
        formData.append("duration", duration);
        formData.append("genre", genre);
        formData.append("artist_id", user_id);

        setUploading(true);
        setMessage("");

        try {
            const response = await axiosInstance.post("/song/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                handleSuccess(t("upload.success"));
                // 🔥 Reset input file bằng ref
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setFile(null);
                setTitle("");
                setAlbum("");
                setDuration("");
                setGenre("");
            } else {
                handleError(t("upload.failure"));
            }
        } catch (error) {
            handleError(t("upload.error"));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-page">
            <Header />
            <div className="upload-content">
                <header className="upload-header">
                    <FaSpotify size={32} color="white" />
                    <h1>{t("upload.title")}</h1>
                </header>
                <div className="upload-container">
                    <input
                        type="file"
                        accept="audio/mp3"
                        onChange={handleFileChange}
                        className="upload-input"
                        ref={fileInputRef}
                    />
                    <label className="upload-label">{t("upload.titlePlaceholder")}</label>
                    <input
                        type="text"
                        placeholder={t("upload.titlePlaceholder")}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="upload-input"
                    />
                    <label className="upload-label">{t("upload.albumPlaceholder")}</label>
                    <input
                        type="text"
                        placeholder={t("upload.albumPlaceholder")}
                        value={album}
                        onChange={(e) => setAlbum(e.target.value)}
                        className="upload-input"
                    />
                    <label className="upload-label">{t("upload.durationPlaceholder")}</label>
                    <input
                        type="text"
                        placeholder={t("upload.durationPlaceholder")}
                        value={duration}
                        disabled
                        className="upload-input"
                    />
                    <label className="upload-label">{t("upload.genrePlaceholder")}</label>
                    <input
                        type="text"
                        placeholder={t("upload.genrePlaceholder")}
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="upload-input"
                    />
                    {message && <p className="upload-message">{message}</p>}
                    <button
                        onClick={handleUpload}
                        className="upload-button"
                        disabled={uploading}
                    >
                        <MdFileUpload size={24} />
                        {uploading ? t("upload.uploading") : t("upload.upload")}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UploadPage;