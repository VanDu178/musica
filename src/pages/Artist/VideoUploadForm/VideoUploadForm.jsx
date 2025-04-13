import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axiosConfig';
import { handleError, handleSuccess } from '../../../helpers/toast';
import { useUserData } from '../../../context/UserDataProvider';
import { checkData } from "../../../helpers/encryptionHelper";
import Forbidden from '../../../components/Error/403/403';
import Loading from '../../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from "react-spinners";
import './VideoUploadForm.css';
import FacebookPlayer from 'react-player/facebook';

const VideoUploadForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoFile: null,
        imageFile: null,
    });
    const { t } = useTranslation();
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [IsCheckingRole, setIsCheckingRole] = useState(false);
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            setIsCheckingRole(true);
            if (isLoggedIn) {
                //nếu đang login thì check role phải artist không
                const checkedRoleUser = await checkData(2);
                if (checkedRoleUser) {
                    setValidRole(true);
                }
                setIsCheckingRole(false);
            }
            setIsCheckingRole(false);
        };

        fetchRole();
    }, [isLoggedIn]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            setFormData({ ...formData, [name]: files[0] });

            // Tạo URL xem trước
            const fileUrl = URL.createObjectURL(files[0]);
            if (name === 'imageFile') {
                setImagePreview(fileUrl);
            } else if (name === 'videoFile') {
                setVideoPreview(fileUrl);
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('videoFile', formData.videoFile);
        data.append('imageFile', formData.imageFile);

        try {
            const response = await axiosInstance.post("/artist/video/", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("after upload video", response);

            if (response.status === 200) {
                handleSuccess(t("artist.video_upload.success"));
            }
        } catch (error) {
            console.error("Upload error:", error);
            handleError(t("artist.video_upload.error"));
        }
        finally {
            setIsProcessing(false);
            setFormData({
                title: '',
                description: '',
                videoFile: null,
                imageFile: null,
            });
            // Cleanup URL để tránh memory leak
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setImagePreview(null);
            setVideoPreview(null);
        }
    };
    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="100" />;
    }

    if (!validRole || !isLoggedIn) {
        return <Forbidden />;
    }

    return (
        <div className="upload-container">
            <div className="upload-form">
                <h2>{t("artist.video_upload.title")}</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="title">{t("artist.video_upload.title_label")}</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder={t("artist.video_upload.title_placeholder")}
                            disabled={isProcessing}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description">{t("artist.video_upload.description_label")}</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder={t("artist.video_upload.description_placeholder")}
                            rows="4"
                            required
                            disabled={isProcessing}
                        />
                    </div>

                    {/* Video File */}
                    <div className="form-group">
                        <label htmlFor="videoFile">{t("artist.video_upload.video_label")}</label>
                        <input
                            type="file"
                            id="videoFile"
                            name="videoFile"
                            accept="video/mp4"
                            onChange={handleFileChange}
                            required
                            disabled={isProcessing}
                        />
                        {videoPreview && (
                            <div className="preview-container">
                                <video src={videoPreview} controls className="video-preview" />
                            </div>
                        )}
                    </div>

                    {/* Image File */}
                    <div className="form-group">
                        <label htmlFor="imageFile">{t("artist.video_upload.image_label")}</label>
                        <input
                            type="file"
                            id="imageFile"
                            name="imageFile"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            disabled={isProcessing}
                        />
                        {imagePreview && (
                            <div className="preview-container">
                                <img src={imagePreview} alt="Thumbnail Preview" className="image-preview" />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={isProcessing} className="upload-btn">
                        {isProcessing && <ClipLoader color="#ffffff" size={16} />}
                        {isProcessing ? t("artist.video_upload.processing") : t("artist.video_upload.upload_btn")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VideoUploadForm;