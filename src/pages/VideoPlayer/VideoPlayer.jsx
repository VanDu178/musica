import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { MdReplay10, MdForward10 } from 'react-icons/md';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const videoId = '14ApoocFqHn394jDCpA-5a2LjsavKx2e0';
    const videoUrl = `http://localhost:8000/api/video/?id=${videoId}`;
    const posterUrl = 'https://via.placeholder.com/800x450?text=Video+Poster';

    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [controlsVisible, setControlsVisible] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false); // Thêm state mới
    const timeoutRef = useRef(null);

    const showControls = () => {
        setControlsVisible(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setControlsVisible(false);
        }, 2500);
    };

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
    }, []);

    const togglePlay = () => {
        setError(null);
        setHasStarted(true);
        setIsPlaying(!isPlaying);
    };

    const handleProgress = ({ played, playedSeconds }) => {
        // Chỉ cập nhật nếu không đang seek
        if (!isSeeking) {
            setProgress(played * 100);
            setCurrentTime(playedSeconds);
        }
        setIsLoading(false);
    };

    const handleDuration = (duration) => {
        setDuration(duration);
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

        if (playerRef.current) {
            playerRef.current.seekTo(seekTime, 'seconds');
        }

        setIsSeeking(false);
    };

    const handleRewind = () => {
        const newTime = Math.max(currentTime - 10, 0);
        if (playerRef.current) {
            playerRef.current.seekTo(newTime, 'seconds');
        }
        setCurrentTime(newTime);
        setProgress((newTime / duration) * 100);
    };

    const handleFastForward = () => {
        const newTime = Math.min(currentTime + 10, duration);
        if (playerRef.current) {
            playerRef.current.seekTo(newTime, 'seconds');
        }
        setCurrentTime(newTime);
        setProgress((newTime / duration) * 100);
    };

    const handleError = (err) => {
        console.error('Lỗi video:', err);
        setError('Không thể phát video. Vui lòng thử lại.');
        setIsLoading(false);
    };

    const handleBuffer = () => setIsLoading(true);
    const handleBufferEnd = () => setIsLoading(false);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="play-video-video-player-container" ref={containerRef}>
            {error && <div className="play-video-error-message">{error}</div>}

            {!hasStarted && (
                <div className="play-video-poster-container">
                    <img src={posterUrl} alt="Video Poster" className="play-video-poster-image" />
                    <div className={`play-video-poster-controls ${controlsVisible ? 'controls-visible' : ''}`}>
                        <button
                            className="play-video-poster-play-btn"
                            onClick={togglePlay}
                            disabled={isLoading}
                        >
                            {isPlaying ? '❚❚' : '▶'}
                        </button>
                    </div>
                </div>
            )}

            <div className={`play-video-video-wrapper ${hasStarted ? '' : 'play-video-hidden'}`}>
                {isLoading ? (
                    <div className="play-video-loading-message">Đang tải video...</div>
                ) : (
                    <div className={`play-video-center-controls ${controlsVisible ? 'controls-visible' : ''}`}>
                        <button
                            className={`play-video-control-btn ${isPlaying ? '' : 'paused'}`}
                            onClick={handleRewind}
                        >
                            <MdReplay10 size={24} />
                        </button>
                        <button
                            className={`play-video-poster-play-btn ${isPlaying ? '' : 'paused'}`}
                            onClick={togglePlay}
                            disabled={isLoading}
                        >
                            {isPlaying ? '❚❚' : '▶'}
                        </button>
                        <button
                            className={`play-video-control-btn ${isPlaying ? '' : 'paused'}`}
                            onClick={handleFastForward}
                        >
                            <MdForward10 size={24} />
                        </button>
                    </div>
                )}
                <div className="play-video-responsive-player">
                    <ReactPlayer
                        ref={playerRef}
                        url={videoUrl}
                        playing={isPlaying}
                        volume={isMuted ? 0 : volume}
                        muted={isMuted}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        onError={handleError}
                        onBuffer={handleBuffer}
                        onBufferEnd={handleBufferEnd}
                        width="100%"
                        height="100%"
                        controls={false}
                        config={{
                            file: {
                                attributes: {
                                    disablePictureInPicture: true,
                                    controlsList: 'nodownload nofullscreen noremoteplayback',
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {hasStarted && (
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
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;