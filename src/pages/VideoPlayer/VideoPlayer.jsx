import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { MdReplay10, MdForward10 } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Forbidden from "../../components/Error/403/403";
import { checkData } from "../../helpers/encryptionHelper";
import Loading from "../../components/Loading/Loading";
import { useUserData } from "../../context/UserDataProvider";
import { useTranslation } from "react-i18next";
import { useIsPlaying } from "../../context/IsPlayingProvider";
import { useSong } from "../../context/SongProvider";
import { FaDownload } from 'react-icons/fa';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const { t } = useTranslation();
    const { title, video_id, image_path } = useParams();
    const decodedImagePath = decodeURIComponent(image_path);
    const videoUrl = `${process.env.REACT_APP_API_URL}/video/play/?id=${video_id}`;
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [controlsVisible, setControlsVisible] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const timeoutRef = useRef(null);
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);
    const [IsCheckingRole, setIsCheckingRole] = useState(true);
    const { isPlaying, setIsPlaying } = useIsPlaying();
    const { idSong, setIdSong } = useSong();

    useEffect(() => {
        const fetchRole = async () => {
            setIsCheckingRole(true);
            if (isLoggedIn) {
                //nếu đang login thì check role phải user  không
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
        const container = containerRef.current;
        if (!container) return;

        const handleInteraction = () => showControls();

        container.addEventListener('mousemove', handleInteraction);
        container.addEventListener('mouseenter', handleInteraction);

        return () => {
            container.removeEventListener('mousemove', handleInteraction);
            container.removeEventListener('mouseenter', handleInteraction);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [IsCheckingRole]);

    useEffect(() => {
        if (isPlayingVideo === true) {
            setIsPlaying(false);
        } else {
            if (idSong != null) {
                setIsPlaying(true);
            }
        }
    }, [isPlayingVideo]);

    useEffect(() => {
        if (isPlaying === true) {
            setIsPlayingVideo(false);
        }
    }, [isPlaying]);

    const showControls = useCallback(() => {
        setControlsVisible(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setControlsVisible(false);
        }, 2500);
    }, []);

    const togglePlay = () => {
        setError(null);
        setHasStarted(true);
        setIsPlayingVideo(!isPlayingVideo);
    };

    const handleProgress = ({ played, playedSeconds }) => {
        if (!isSeeking) {
            setProgress(played * 100);
            setCurrentTime(playedSeconds);
        }
        setIsLoading(false);
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handlePlayerSeek = (seconds) => {
        setCurrentTime(seconds);
        setProgress((seconds / duration) * 100);
        setIsSeeking(false);
    };

    const handleSeekMouseDown = () => {
        setIsSeeking(true);
    };

    const handleSeek = (e) => {
        const seekValue = parseFloat(e.target.value);
        const seekTime = (seekValue / 100) * duration;
        setProgress(seekValue);
        setCurrentTime(seekTime);
    };

    const handleSeekMouseUp = (e) => {
        const seekValue = parseFloat(e.target.value);
        const seekTime = (seekValue / 100) * duration;

        try {
            if (playerRef.current) {
                playerRef.current.seekTo(seekTime, 'seconds');
            }
        } catch (err) {
            console.error('Seek error:', err);
            setError('Không thể tua video.');
        }
        setIsSeeking(false);
    };

    const handleRewind = () => {
        const newTime = Math.max(currentTime - 10, 0);
        if (playerRef.current) {
            playerRef.current.seekTo(newTime, 'seconds');
        }
    };

    const handleFastForward = () => {
        const newTime = Math.min(currentTime + 10, duration);
        if (playerRef.current) {
            playerRef.current.seekTo(newTime, 'seconds');
        }
    };

    const handleError = (err, data) => {
        console.error('Video error:', err, data);
        setError(`Không thể phát video`);
        setIsLoading(false);
    };

    const handleBuffer = () => setIsLoading(true);
    const handleBufferEnd = () => setIsLoading(false);

    const handleReady = () => {
        console.log('Player ready');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        setRetryCount(prev => prev + 1);
        setIsPlayingVideo(true); // Tự động phát khi thử lại
    };

    const handleEnded = () => {
        setHasStarted(false);
        setIsPlayingVideo(false); // Tạm dừng video
        setProgress(0); // Đặt lại thanh tiến trình
        setCurrentTime(0); // Đặt lại thời gian hiện tại
        if (playerRef.current) {
            playerRef.current.seekTo(0, 'seconds'); // Đặt video về đầu
        }
        setRetryCount(prev => prev + 1);
    };

    const handleDownload = () => {
        // Chuyển hướng qua trang download trung gian
        window.open(`/download/video/${video_id}`, '_blank');
    };

    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="100" />;
    }

    if (!isLoggedIn || !validRole) {
        return <Forbidden />;
    }

    return (
        <>
            <div className="play-video-video-player-container" ref={containerRef}>
                <div
                    className={`play-video-title ${controlsVisible ? 'controls-visible' : ''}`}
                >{title}</div>

                {error && (
                    <div className="play-video-error-message" >
                        {error}
                        < button
                            className="play-video-retry-btn"
                            onClick={handleRetry}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang thử lại...' : 'Thử lại'}
                        </button>
                    </div >
                )}
                {
                    !hasStarted && (
                        <div className="play-video-poster-container">
                            <img
                                src={decodedImagePath}
                                alt="Video Poster"
                                className="play-video-poster-image"
                            />
                            <div className={`play-video-poster-controls ${controlsVisible ? 'controls-visible' : ''}`}>
                                <button
                                    className="play-video-poster-play-btn"
                                    onClick={togglePlay}
                                    disabled={isLoading}
                                >
                                    {isPlayingVideo ? '❚❚' : '▶'}
                                </button>
                            </div>
                        </div>
                    )
                }

                <div className={`play-video-video-wrapper ${hasStarted ? '' : 'play-video-hidden'}`}>
                    {isLoading ? (
                        <div className="play-video-loading-message">Đang tải video...</div>
                    ) : (
                        <div className={`play-video-center-controls ${controlsVisible ? 'controls-visible' : ''}`}>
                            <button
                                className={`play-video-control-btn ${isPlayingVideo ? '' : 'paused'}`}
                                onClick={handleRewind}
                            >
                                <MdReplay10 size={24} />
                            </button>
                            <button
                                className={`play-video-poster-play-btn ${isPlayingVideo ? '' : 'paused'}`}
                                onClick={togglePlay}
                                disabled={isLoading}
                            >
                                {isPlayingVideo ? '❚❚' : '▶'}
                            </button>
                            <button
                                className={`play-video-control-btn ${isPlayingVideo ? '' : 'paused'}`}
                                onClick={handleFastForward}
                            >
                                <MdForward10 size={24} />
                            </button>
                        </div>
                    )}
                    <div className="play-video-responsive-player">
                        <ReactPlayer
                            key={`player-${retryCount}`} // Thêm key này để force re-mount khi retry
                            url={`${videoUrl}&retry=${retryCount}`} // Thêm param retry để tránh cache
                            ref={playerRef}
                            playing={isPlayingVideo}
                            volume={isMuted ? 0 : volume}
                            muted={isMuted}
                            onProgress={handleProgress}
                            onDuration={handleDuration}
                            onError={handleError}
                            onBuffer={handleBuffer}
                            onBufferEnd={handleBufferEnd}
                            onSeek={handlePlayerSeek}
                            onReady={handleReady}
                            onEnded={handleEnded}
                            width="100%"
                            height="100%"
                            controls={false}
                            progressInterval={100}
                            config={{
                                file: {
                                    attributes: {
                                        disablePictureInPicture: true,
                                        controlsList: 'nodownload nofullscreen noremoteplayback',
                                        crossOrigin: 'anonymous',
                                    },
                                    forceVideo: true,
                                    forceHLS: false,
                                    forceDASH: false,
                                }
                            }}
                        />
                    </div>
                </div>

                {
                    hasStarted && (
                        <div className={`play-video-controls ${controlsVisible ? 'controls-visible' : ''}`}>
                            <div className="play-video-time-display">
                                <span>{formatTime(currentTime)}</span>
                            </div>
                            <input
                                type="range"
                                className="play-video-progress-bar"
                                value={progress || 0}
                                onChange={handleSeek}
                                onMouseDown={handleSeekMouseDown}
                                onMouseUp={handleSeekMouseUp}
                                min="0"
                                max="100"
                                step="0.1"
                                style={{ '--progress': `${progress}%` }}
                            />
                            <div className="play-video-time-display">
                                <span>{formatTime(duration)}</span>
                            </div>
                            <button
                                className="play-video-download-btn"
                                onClick={handleDownload}
                                title="Download video"
                            >
                                <FaDownload size={18} />
                            </button>
                        </div>
                    )
                }
            </div >
        </>
    );
};

export default VideoPlayer;