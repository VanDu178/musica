// VideoDownloadPage.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './VideoDownloadPage.css';
import axiosInstance from '../../config/axiosConfig';
import Loading from "../../components/Loading/Loading";
import { useUserData } from "../../context/UserDataProvider";
import { checkData } from "../../helpers/encryptionHelper";
import { useTranslation } from "react-i18next";
import Forbidden from "../../components/Error/403/403";

const VideoDownloadPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);
    const [IsCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            setIsCheckingRole(true);
            if (isLoggedIn) {
                const checkedRoleUser = await checkData(3);
                if (checkedRoleUser) {
                    setValidRole(true);
                }
            }
            setIsCheckingRole(false);
        };
        fetchRole();
    }, [isLoggedIn]);

    const downloadVideo = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`/video/download/?id=${id}`, {
                responseType: 'blob',
                validateStatus: (status) => {
                    // Chỉ xem là thành công khi status là 200
                    return status === 200;
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `video_${id}.mp4`);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            setDownloaded(true);
        } catch (error) {
            console.error('Download error:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setError('Bạn cần đăng nhập để tải video');
                        break;
                    case 403:
                        setError('Bạn không có quyền tải video này');
                        break;
                    default:
                        setError('Đã xảy ra lỗi khi tải video');
                }
            } else {
                setError('Không thể kết nối đến server');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        downloadVideo();
    };

    useEffect(() => {
        if (downloaded) {
            const timer = setTimeout(() => {
                window.close() || navigate(-1);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [downloaded, navigate]);

    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="100" />;
    }

    if (!isLoggedIn || !validRole) {
        return <Forbidden />;
    }

    return (
        <div className="spotify-download-container">
            {isLoading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Đang tải xuống...</p>
                </div>
            ) : downloaded ? (
                <div className="success-state">
                    <FaCheckCircle size={50} color="#1DB954" />
                    <p>Tải xuống thành công!</p>
                </div>
            ) : error ? (
                <div className="error-state">
                    <FaTimesCircle size={50} color="#FF0000" />
                    <p>{error}</p>
                </div>
            ) : (
                <div className="download-content">
                    <h1>Tải Video</h1>
                    <p>Sẵn sàng để tải video của bạn về máy!</p>
                    <button onClick={handleDownload} disabled={isLoading}>
                        <FaDownload size={20} style={{ marginRight: '8px' }} />
                        Tải Xuống
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoDownloadPage;